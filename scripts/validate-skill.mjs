import { spawnSync } from "node:child_process";
import { lstatSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, posix, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseDocument } from "yaml";
import { loadCanonicalContent, renderArtifacts } from "./build-skill.mjs";

const MAX_TEXT_FILE_BYTES = 5 * 1024 * 1024;
const MAX_FRONTMATTER_BYTES = 64 * 1024;
const MAX_ERRORS = 100;
const PACK_TIMEOUT_MS = 30_000;
const PACK_MAX_BUFFER_BYTES = 1024 * 1024;

export const APPROVED_PACKAGE_FILES = Object.freeze([
  "CHANGELOG.md",
  "LICENSE",
  "README.md",
  "SKILL.md",
  "assets/banner.svg",
  "package.json",
]);

export const EXPECTED_SCRIPTS = Object.freeze({
  build: "node scripts/build-skill.mjs",
  test: "node --test scripts/validate-skill.test.mjs && npm run validate",
  validate: "node scripts/validate-skill.mjs",
  "pack:check": "node scripts/validate-skill.mjs --only=tarball",
});

const MONTH_YEAR_PATTERN =
  "(?:January|February|March|April|May|June|July|August|September|October|November|December) \\d{4}";

const STABLE_CAPABILITIES = Object.freeze([
  {
    name: "compatibility policy",
    requirements: [
      ["MDN Baseline", /MDN Baseline/i],
      ["Widely available guidance", /Widely available/i],
      ["Limited availability guidance", /Limited availability/i],
    ],
  },
  {
    name: "actionable CSS guidance",
    requirements: [["a CSS example", /```css\r?\n[\s\S]*?\r?\n```/]],
  },
  {
    name: "fallback guidance",
    requirements: [
      ["@supports", /@supports/],
      ["fallback language", /\bfallback\b/i],
    ],
  },
  {
    name: "user-preference guidance",
    requirements: [
      ["prefers-reduced-motion", /prefers-reduced-motion/],
      ["forced-colors", /forced-colors/],
    ],
  },
  {
    name: "Tailwind mapping",
    requirements: [
      ["Tailwind v4", /Tailwind v4/i],
      ["@theme", /@theme/],
      ["@utility", /@utility/],
    ],
  },
]);

function addError(errors, message) {
  if (errors.length < MAX_ERRORS) {
    errors.push(message);
    return;
  }

  if (errors.length === MAX_ERRORS) {
    errors.push(`Validation stopped after ${MAX_ERRORS} errors.`);
  }
}

function readTextFile(rootDir, relativePath, errors) {
  const absolutePath = join(rootDir, relativePath);

  try {
    const metadata = lstatSync(absolutePath);

    if (!metadata.isFile() || metadata.isSymbolicLink()) {
      addError(errors, `${relativePath} must be a regular file, not a symlink.`);
      return null;
    }

    if (metadata.size > MAX_TEXT_FILE_BYTES) {
      addError(
        errors,
        `${relativePath} exceeds the ${MAX_TEXT_FILE_BYTES}-byte validation limit.`,
      );
      return null;
    }

    return readFileSync(absolutePath, "utf8");
  } catch (error) {
    addError(errors, `${relativePath} could not be read: ${error.message}`);
    return null;
  }
}

function parsePackageJson(packageText, errors) {
  if (packageText === null) {
    return null;
  }

  try {
    const packageJson = JSON.parse(packageText);

    if (packageJson === null || Array.isArray(packageJson) || typeof packageJson !== "object") {
      addError(errors, "package.json must contain a JSON object.");
      return null;
    }

    return packageJson;
  } catch (error) {
    addError(errors, `package.json contains invalid JSON: ${error.message}`);
    return null;
  }
}

function extractFrontmatter(markdown, errors) {
  const lines = markdown.split(/\r?\n/);

  if (lines[0] !== "---") {
    addError(errors, "SKILL.md must begin with YAML frontmatter on the first line.");
    return null;
  }

  const closingIndex = lines.indexOf("---", 1);

  if (closingIndex === -1) {
    addError(errors, "SKILL.md YAML frontmatter is missing its closing delimiter.");
    return null;
  }

  const source = lines.slice(1, closingIndex).join("\n");

  if (Buffer.byteLength(source, "utf8") > MAX_FRONTMATTER_BYTES) {
    addError(
      errors,
      `SKILL.md YAML frontmatter exceeds ${MAX_FRONTMATTER_BYTES} bytes.`,
    );
    return null;
  }

  return source;
}

function validateFrontmatter(markdown, errors) {
  const source = extractFrontmatter(markdown, errors);

  if (source === null) {
    return null;
  }

  const document = parseDocument(source, {
    prettyErrors: true,
    strict: true,
    uniqueKeys: true,
  });

  for (const error of document.errors) {
    addError(errors, `SKILL.md contains invalid YAML frontmatter: ${error.message}`);
  }

  if (document.errors.length > 0) {
    return null;
  }

  let frontmatter;

  try {
    frontmatter = document.toJS({ maxAliasCount: 10 });
  } catch (error) {
    addError(errors, `SKILL.md YAML frontmatter could not be resolved: ${error.message}`);
    return null;
  }

  if (frontmatter === null || Array.isArray(frontmatter) || typeof frontmatter !== "object") {
    addError(errors, "SKILL.md YAML frontmatter must contain a mapping.");
    return null;
  }

  const { name, description } = frontmatter;

  if (typeof name !== "string" || name.trim() === "") {
    addError(errors, 'SKILL.md frontmatter requires a non-empty string field named "name".');
  } else {
    const nameLength = [...name].length;

    if (nameLength > 64) {
      addError(errors, `SKILL.md frontmatter name exceeds 64 characters (${nameLength}).`);
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
      addError(
        errors,
        "SKILL.md frontmatter name must use lowercase letters, numbers, and internal hyphens only.",
      );
    }
  }

  if (typeof description !== "string" || description.trim() === "") {
    addError(
      errors,
      'SKILL.md frontmatter requires a non-empty string field named "description".',
    );
  } else {
    const descriptionLength = [...description].length;

    if (descriptionLength > 1024) {
      addError(
        errors,
        `SKILL.md frontmatter description exceeds 1024 characters (${descriptionLength}).`,
      );
    }
  }

  return frontmatter;
}

function validateReferenceId(id, lineNumber, errors) {
  if (!/^ref-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    addError(
      errors,
      `SKILL.md:${lineNumber} reference identifier [${id}] must use lowercase letters, numbers, and internal hyphens.`,
    );
  }
}

function validateReferences(markdown, errors) {
  const definitions = new Map();
  const usages = new Map();
  const lines = markdown.split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    const lineNumber = index + 1;
    const definitionMatch = line.match(/^\[([^\]]+)\]:\s*(.*)$/);
    let definitionStart = -1;
    let definitionId = null;

    if (definitionMatch && definitionMatch[1].toLowerCase().startsWith("ref-")) {
      definitionId = definitionMatch[1];
      definitionStart = line.indexOf(`[${definitionId}]`);
      const normalizedId = definitionId.toLowerCase();
      const destination = definitionMatch[2].trim();

      validateReferenceId(definitionId, lineNumber, errors);

      if (destination === "") {
        addError(
          errors,
          `SKILL.md:${lineNumber} reference definition [${definitionId}] has no destination.`,
        );
      }

      const existing = definitions.get(normalizedId);

      if (existing) {
        addError(
          errors,
          `SKILL.md:${lineNumber} duplicate reference definition [${definitionId}] (first defined at line ${existing.lineNumber}).`,
        );
      } else {
        definitions.set(normalizedId, { id: definitionId, lineNumber, destination });
      }
    }

    const usagePattern = /\[(ref-[^\]]+)\]/gi;
    let usageMatch;

    while ((usageMatch = usagePattern.exec(line)) !== null) {
      if (usageMatch.index === definitionStart && usageMatch[1] === definitionId) {
        continue;
      }

      const id = usageMatch[1];
      const normalizedId = id.toLowerCase();
      validateReferenceId(id, lineNumber, errors);

      if (!usages.has(normalizedId)) {
        usages.set(normalizedId, { id, lineNumber });
      }
    }
  }

  if (definitions.size === 0) {
    addError(errors, "SKILL.md must define at least one [ref-*] source reference.");
  }

  for (const [normalizedId, usage] of usages) {
    if (!definitions.has(normalizedId)) {
      addError(
        errors,
        `SKILL.md:${usage.lineNumber} reference usage [${usage.id}] has no definition.`,
      );
    }
  }

  for (const [normalizedId, definition] of definitions) {
    if (!usages.has(normalizedId)) {
      addError(
        errors,
        `SKILL.md:${definition.lineNumber} reference definition [${definition.id}] is unused.`,
      );
    }
  }

  return { definitionCount: definitions.size, usageCount: usages.size };
}

function validateStableCapabilities(markdown, errors) {
  for (const capability of STABLE_CAPABILITIES) {
    const missing = capability.requirements
      .filter(([, pattern]) => !pattern.test(markdown))
      .map(([label]) => label);

    if (missing.length > 0) {
      addError(
        errors,
        `SKILL.md is missing the stable capability "${capability.name}": ${missing.join(
          ", ",
        )}.`,
      );
    }
  }
}

const CANONICAL_ARTIFACT_PATHS = Object.freeze({
  compatibility_summary: "docs/compatibility-summary.md",
  evidence_index: "docs/evidence-index.md",
  skill: "SKILL.md",
});

const CANONICAL_POLICY_FIELDS = Object.freeze([
  "id",
  "strength",
  "rule",
  "applies_when",
  "exceptions",
  "verification",
]);

const CANONICAL_CAPABILITY_FIELDS = Object.freeze([
  "id",
  "concept",
  "recommendation",
  "use_when",
  "avoid_when",
  "fallback",
]);

const CLAIM_STATUSES = new Set(["widely", "newly", "limited", "watchlist"]);
const SOURCE_REFERENCE_PATTERN = /\[(ref-[a-z0-9]+(?:-[a-z0-9]+)*)\]/g;

function isRecord(value) {
  return value !== null && !Array.isArray(value) && typeof value === "object";
}

function validateString(value, label, errors) {
  if (typeof value !== "string" || value.trim() === "") {
    addError(errors, `${label} must be a non-empty string.`);
    return false;
  }

  return true;
}

function validateStringArray(value, label, errors) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string" || entry === "")) {
    addError(errors, `${label} must be an array of non-empty strings.`);
    return false;
  }

  return true;
}

function collectCanonicalModuleReferences(markdown) {
  const references = new Set();
  let match;

  while ((match = SOURCE_REFERENCE_PATTERN.exec(markdown)) !== null) {
    references.add(match[1]);
  }

  SOURCE_REFERENCE_PATTERN.lastIndex = 0;
  return references;
}

function validateCanonicalContent(rootDir, errors) {
  let content;

  try {
    content = loadCanonicalContent(rootDir);
  } catch (error) {
    addError(errors, `Canonical content could not be loaded: ${error.message}`);
    return;
  }

  const { manifest, policies, capabilities, evidence, migration, modules, sources } = content;

  for (const [label, document] of Object.entries({
    manifest,
    policies,
    capabilities,
    evidence,
    migration,
  })) {
    if (!isRecord(document) || document.schema_version !== 1) {
      addError(errors, `content/${label}.yml must declare schema_version: 1.`);
    }
  }

  if (!isRecord(manifest.skill)) {
    addError(errors, "content/manifest.yml requires a skill mapping.");
  } else {
    validateString(manifest.skill.name, "content/manifest.yml skill.name", errors);
    validateString(manifest.skill.description, "content/manifest.yml skill.description", errors);
    validateString(manifest.skill.validation_window, "content/manifest.yml skill.validation_window", errors);
  }

  if (!isRecord(manifest.artifacts)) {
    addError(errors, "content/manifest.yml requires an artifacts mapping.");
  } else {
    for (const [name, expectedPath] of Object.entries(CANONICAL_ARTIFACT_PATHS)) {
      if (manifest.artifacts[name] !== expectedPath) {
        addError(
          errors,
          `content/manifest.yml artifact ${name} must remain ${expectedPath} to preserve the package contract.`,
        );
      }
    }
  }

  const moduleIds = new Set();

  for (const module of modules) {
    if (!validateString(module.id, `content/manifest.yml module id`, errors)) {
      continue;
    }

    if (moduleIds.has(module.id)) {
      addError(errors, `content/manifest.yml duplicates module id ${module.id}.`);
    }

    moduleIds.add(module.id);

    if (!isRecord(module.metadata)) {
      addError(errors, `${module.relativePath} frontmatter must be a mapping.`);
      continue;
    }

    if (module.metadata.id !== module.id) {
      addError(
        errors,
        `${module.relativePath} frontmatter id must match manifest module id ${module.id}.`,
      );
    }

    if (!["policy", "concept"].includes(module.metadata.type)) {
      addError(errors, `${module.relativePath} frontmatter type must be policy or concept.`);
    }

    validateString(module.metadata.title, `${module.relativePath} frontmatter title`, errors);
    validateStringArray(module.metadata.policy_ids, `${module.relativePath} policy_ids`, errors);
    validateStringArray(module.metadata.capability_ids, `${module.relativePath} capability_ids`, errors);

    if (module.body.trim() === "") {
      addError(errors, `${module.relativePath} must contain Markdown guidance.`);
    }
  }

  const policyIds = new Set();
  const policyEntries = Array.isArray(policies.policies) ? policies.policies : [];

  if (!Array.isArray(policies.policies)) {
    addError(errors, "content/policies.yml policies must be an array.");
  }

  for (const policy of policyEntries) {
    if (!isRecord(policy)) {
      addError(errors, "content/policies.yml contains a non-mapping policy.");
      continue;
    }

    for (const field of CANONICAL_POLICY_FIELDS) {
      validateString(policy[field], `Policy ${policy.id || "<unknown>"}.${field}`, errors);
    }

    if (policyIds.has(policy.id)) {
      addError(errors, `content/policies.yml duplicates policy id ${policy.id}.`);
    }

    policyIds.add(policy.id);
  }

  const capabilityIds = new Set();
  const capabilityEntries = Array.isArray(capabilities.capabilities)
    ? capabilities.capabilities
    : [];

  if (!Array.isArray(capabilities.capabilities)) {
    addError(errors, "content/capabilities.yml capabilities must be an array.");
  }

  for (const capability of capabilityEntries) {
    if (!isRecord(capability)) {
      addError(errors, "content/capabilities.yml contains a non-mapping capability.");
      continue;
    }

    for (const field of CANONICAL_CAPABILITY_FIELDS) {
      validateString(
        capability[field],
        `Capability ${capability.id || "<unknown>"}.${field}`,
        errors,
      );
    }

    if (!moduleIds.has(capability.concept)) {
      addError(
        errors,
        `Capability ${capability.id || "<unknown>"} has unknown concept ${capability.concept}.`,
      );
    }

    if (capabilityIds.has(capability.id)) {
      addError(errors, `content/capabilities.yml duplicates capability id ${capability.id}.`);
    }

    capabilityIds.add(capability.id);
  }

  const sourceIds = new Set(sources.keys());
  const sourceUsage = new Set();
  const claimIds = new Set();
  const claimEntries = Array.isArray(evidence.claims) ? evidence.claims : [];

  if (!Array.isArray(evidence.claims)) {
    addError(errors, "content/evidence.yml claims must be an array.");
  }

  for (const claim of claimEntries) {
    if (!isRecord(claim)) {
      addError(errors, "content/evidence.yml contains a non-mapping claim.");
      continue;
    }

    validateString(claim.id, "Compatibility claim id", errors);
    validateString(claim.capability_id, `Claim ${claim.id || "<unknown>"}.capability_id`, errors);
    validateString(claim.reviewed_at, `Claim ${claim.id || "<unknown>"}.reviewed_at`, errors);
    validateString(claim.fallback, `Claim ${claim.id || "<unknown>"}.fallback`, errors);
    validateStringArray(claim.source_ids, `Claim ${claim.id || "<unknown>"}.source_ids`, errors);

    if (!CLAIM_STATUSES.has(claim.status)) {
      addError(errors, `Claim ${claim.id || "<unknown>"} has invalid status ${claim.status}.`);
    }

    if (!capabilityIds.has(claim.capability_id)) {
      addError(
        errors,
        `Claim ${claim.id || "<unknown>"} references unknown capability ${claim.capability_id}.`,
      );
    }

    if (claimIds.has(claim.id)) {
      addError(errors, `content/evidence.yml duplicates claim id ${claim.id}.`);
    }

    claimIds.add(claim.id);

    for (const sourceId of claim.source_ids || []) {
      if (!sourceIds.has(sourceId)) {
        addError(errors, `Claim ${claim.id || "<unknown>"} references unknown source ${sourceId}.`);
      } else {
        sourceUsage.add(sourceId);
      }
    }
  }

  for (const module of modules) {
    for (const policyId of module.metadata?.policy_ids || []) {
      if (!policyIds.has(policyId)) {
        addError(errors, `${module.relativePath} references unknown policy ${policyId}.`);
      }
    }

    for (const capabilityId of module.metadata?.capability_ids || []) {
      if (!capabilityIds.has(capabilityId)) {
        addError(errors, `${module.relativePath} references unknown capability ${capabilityId}.`);
      }
    }

    for (const sourceId of collectCanonicalModuleReferences(module.body)) {
      if (!sourceIds.has(sourceId)) {
        addError(errors, `${module.relativePath} references unknown source ${sourceId}.`);
      } else {
        sourceUsage.add(sourceId);
      }
    }
  }

  for (const sourceId of sourceIds) {
    if (!sourceUsage.has(sourceId)) {
      addError(errors, `content/evidence.yml source ${sourceId} is not used by a claim or module.`);
    }
  }

  const legacyEntries = Array.isArray(migration.legacy_entries) ? migration.legacy_entries : [];

  if (!Array.isArray(migration.legacy_entries)) {
    addError(errors, "content/migration.yml legacy_entries must be an array.");
  }

  if (migration.legacy_entry_count !== legacyEntries.length) {
    addError(
      errors,
      "content/migration.yml legacy_entry_count must equal the number of legacy_entries.",
    );
  }

  const legacyIds = new Set();

  for (const legacyEntry of legacyEntries) {
    if (!isRecord(legacyEntry)) {
      addError(errors, "content/migration.yml contains a non-mapping legacy entry.");
      continue;
    }

    validateString(legacyEntry.id, "Legacy entry id", errors);
    validateString(legacyEntry.destination, `Legacy entry ${legacyEntry.id || "<unknown>"}.destination`, errors);

    if (legacyIds.has(legacyEntry.id)) {
      addError(errors, `content/migration.yml duplicates legacy entry ${legacyEntry.id}.`);
    }

    legacyIds.add(legacyEntry.id);

    if (!moduleIds.has(legacyEntry.destination)) {
      addError(
        errors,
        `Legacy entry ${legacyEntry.id || "<unknown>"} has unknown destination ${legacyEntry.destination}.`,
      );
    }
  }

  let artifacts;

  try {
    artifacts = renderArtifacts(rootDir);
  } catch (error) {
    addError(errors, `Canonical artifacts could not be rendered: ${error.message}`);
    return;
  }

  for (const [relativePath, expected] of Object.entries(artifacts)) {
    const actual = readTextFile(rootDir, relativePath, errors);

    if (actual !== null && actual !== expected) {
      addError(
        errors,
        `${relativePath} is stale. Edit content/ and run npm run build instead of editing generated output.`,
      );
    }
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractReadmeVersion(readme, errors) {
  const matches = [
    ...readme.matchAll(
      /^- Package version:\s+\[`([^`]+)`\]\(\.\/package\.json\)\s*$/gm,
    ),
  ];

  if (matches.length !== 1) {
    addError(
      errors,
      `README.md must contain exactly one package-version line; found ${matches.length}.`,
    );
    return null;
  }

  return matches[0][1];
}

function extractCurrentChangelogSection(changelog, version, errors) {
  const headingPattern = new RegExp(`^## \\[${escapeRegExp(version)}\\][^\\n]*$`, "m");
  const headingMatch = headingPattern.exec(changelog);

  if (!headingMatch) {
    addError(errors, `CHANGELOG.md has no release section for package version ${version}.`);
    return null;
  }

  const sectionStart = headingMatch.index + headingMatch[0].length;
  const remaining = changelog.slice(sectionStart);
  const nextHeading = remaining.search(/^## \[/m);

  return nextHeading === -1 ? remaining : remaining.slice(0, nextHeading);
}

function validateVersions(packageJson, readme, changelog, errors) {
  const version = packageJson.version;

  if (typeof version !== "string" || version.trim() === "") {
    addError(errors, 'package.json requires a non-empty string field named "version".');
    return null;
  }

  const readmeVersion = extractReadmeVersion(readme, errors);

  if (readmeVersion !== null && readmeVersion !== version) {
    addError(
      errors,
      `README.md documents package version ${readmeVersion}, but package.json is ${version}.`,
    );
  }

  const changelogSection = extractCurrentChangelogSection(changelog, version, errors);
  return { version, changelogSection };
}

function extractValidationWindow(skill, readme, errors) {
  const skillPattern = new RegExp(
    `Statuses in this file were verified[\\s\\S]{0,300}?\\*\\*(${MONTH_YEAR_PATTERN})\\*\\*`,
  );
  const skillMatch = skill.match(skillPattern);
  const readmePattern = new RegExp(
    `^- Last validation window:\\s+(${MONTH_YEAR_PATTERN})\\s*$`,
    "m",
  );
  const readmeMatch = readme.match(readmePattern);

  if (!skillMatch) {
    addError(errors, "SKILL.md does not declare its current validation month.");
  }

  if (!readmeMatch) {
    addError(errors, "README.md does not declare its current validation month.");
  }

  if (!skillMatch || !readmeMatch) {
    return null;
  }

  if (skillMatch[1] !== readmeMatch[1]) {
    addError(
      errors,
      `Validation-window drift: SKILL.md says ${skillMatch[1]}, but README.md says ${readmeMatch[1]}.`,
    );
  }

  return skillMatch[1];
}

function validateValidationWindow(skill, readme, changelogSection, errors) {
  const validationWindow = extractValidationWindow(skill, readme, errors);

  if (
    validationWindow !== null &&
    changelogSection !== null &&
    !changelogSection.includes(validationWindow)
  ) {
    addError(
      errors,
      `CHANGELOG.md current release does not mention validation window ${validationWindow}.`,
    );
  }

  return validationWindow;
}

function validatePackageScripts(packageJson, errors) {
  const scripts = packageJson.scripts;

  if (scripts === null || Array.isArray(scripts) || typeof scripts !== "object") {
    addError(errors, "package.json must define the content-contract scripts.");
    return;
  }

  for (const [name, expectedCommand] of Object.entries(EXPECTED_SCRIPTS)) {
    if (scripts[name] !== expectedCommand) {
      addError(
        errors,
        `package.json script "${name}" must be exactly: ${expectedCommand}`,
      );
    }
  }
}

function isSafePackagePath(entry) {
  return (
    typeof entry === "string" &&
    entry !== "" &&
    !isAbsolute(entry) &&
    !entry.includes("\\") &&
    !/[!*?\[\]{}]/.test(entry) &&
    posix.normalize(entry) === entry &&
    !entry.startsWith("../") &&
    entry !== ".."
  );
}

function validatePackageAllowlist(rootDir, packageJson, errors) {
  const files = packageJson.files;
  const approvedAllowlist = APPROVED_PACKAGE_FILES.filter((path) => path !== "package.json");

  if (!Array.isArray(files)) {
    addError(errors, "package.json files must be an explicit array.");
    return;
  }

  const duplicates = files.filter((entry, index) => files.indexOf(entry) !== index);

  if (duplicates.length > 0) {
    addError(
      errors,
      `package.json files contains duplicate entries: ${[...new Set(duplicates)].join(", ")}.`,
    );
  }

  const missing = approvedAllowlist.filter((path) => !files.includes(path));
  const unapproved = files.filter((path) => !approvedAllowlist.includes(path));

  if (missing.length > 0) {
    addError(errors, `package.json files is missing approved paths: ${missing.join(", ")}.`);
  }

  if (unapproved.length > 0) {
    addError(errors, `package.json files contains unapproved paths: ${unapproved.join(", ")}.`);
  }

  for (const entry of files) {
    if (!isSafePackagePath(entry)) {
      addError(errors, `package.json files contains an unsafe or non-literal path: ${entry}.`);
      continue;
    }

    try {
      const metadata = lstatSync(join(rootDir, entry));

      if (!metadata.isFile() || metadata.isSymbolicLink()) {
        addError(errors, `Approved package path must be a regular file: ${entry}.`);
      }
    } catch (error) {
      addError(errors, `Approved package path could not be read (${entry}): ${error.message}`);
    }
  }
}

export function validateTarballFileSet(actualFiles, errors) {
  if (!Array.isArray(actualFiles) || actualFiles.some((path) => typeof path !== "string")) {
    addError(errors, "npm tarball file listing must contain only string paths.");
    return;
  }

  const actual = [...new Set(actualFiles)].sort();
  const expected = [...APPROVED_PACKAGE_FILES].sort();
  const missing = expected.filter((path) => !actual.includes(path));
  const unexpected = actual.filter((path) => !expected.includes(path));

  if (actual.length !== actualFiles.length) {
    addError(errors, "npm tarball file listing contains duplicate paths.");
  }

  if (missing.length > 0) {
    addError(errors, `npm tarball is missing approved files: ${missing.join(", ")}.`);
  }

  if (unexpected.length > 0) {
    addError(errors, `npm tarball contains unapproved files: ${unexpected.join(", ")}.`);
  }
}

function executeNpmPack(rootDir) {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

  return spawnSync(
    npmCommand,
    ["pack", "--dry-run", "--json", "--ignore-scripts"],
    {
      cwd: rootDir,
      encoding: "utf8",
      env: {
        ...process.env,
        npm_config_audit: "false",
        npm_config_fund: "false",
        npm_config_offline: "true",
        npm_config_update_notifier: "false",
      },
      maxBuffer: PACK_MAX_BUFFER_BYTES,
      shell: false,
      timeout: PACK_TIMEOUT_MS,
      windowsHide: true,
    },
  );
}

function runTarballValidation(rootDir, errors, packRunner) {
  let result;

  try {
    result = packRunner(rootDir);
  } catch (error) {
    addError(errors, `npm pack could not run: ${error.message}`);
    return [];
  }

  if (result === null || typeof result !== "object") {
    addError(errors, "npm pack returned no process result.");
    return [];
  }

  if (result.error) {
    addError(errors, `npm pack could not run: ${result.error.message}`);
    return [];
  }

  if (result.status !== 0) {
    const diagnostic = (result.stderr || result.stdout || "no diagnostic output")
      .trim()
      .slice(0, 1000);
    addError(errors, `npm pack exited with status ${result.status}: ${diagnostic}`);
    return [];
  }

  let reports;

  try {
    reports = JSON.parse(result.stdout);
  } catch (error) {
    addError(errors, `npm pack returned invalid JSON: ${error.message}`);
    return [];
  }

  if (
    !Array.isArray(reports) ||
    reports.length !== 1 ||
    reports[0] === null ||
    typeof reports[0] !== "object" ||
    !Array.isArray(reports[0].files) ||
    reports[0].files.some(
      (entry) =>
        entry === null || typeof entry !== "object" || typeof entry.path !== "string",
    )
  ) {
    addError(errors, "npm pack returned an unexpected JSON structure.");
    return [];
  }

  const files = reports[0].files.map((entry) => entry.path);
  validateTarballFileSet(files, errors);
  return files;
}

export function validateRepository(
  rootDir,
  {
    includeTarball = true,
    onlyTarball = false,
    packRunner = executeNpmPack,
  } = {},
) {
  const resolvedRoot = resolve(rootDir);
  const errors = [];
  const details = {};
  const packageText = readTextFile(resolvedRoot, "package.json", errors);
  const packageJson = parsePackageJson(packageText, errors);

  if (packageJson !== null) {
    validatePackageAllowlist(resolvedRoot, packageJson, errors);
    validatePackageScripts(packageJson, errors);
  }

  if (!onlyTarball) {
    validateCanonicalContent(resolvedRoot, errors);
    const skill = readTextFile(resolvedRoot, "SKILL.md", errors);
    const readme = readTextFile(resolvedRoot, "README.md", errors);
    const changelog = readTextFile(resolvedRoot, "CHANGELOG.md", errors);

    if (skill !== null) {
      validateFrontmatter(skill, errors);
      details.references = validateReferences(skill, errors);
      validateStableCapabilities(skill, errors);
    }

    if (packageJson !== null && readme !== null && changelog !== null) {
      const versionState = validateVersions(packageJson, readme, changelog, errors);

      if (skill !== null && versionState !== null) {
        details.validationWindow = validateValidationWindow(
          skill,
          readme,
          versionState.changelogSection,
          errors,
        );
      }
    }
  }

  if (includeTarball && packageJson !== null) {
    details.tarballFiles = runTarballValidation(resolvedRoot, errors, packRunner);
  }

  return { details, errors, ok: errors.length === 0 };
}

function parseCliArguments(args) {
  if (args.length === 0) {
    return { onlyTarball: false };
  }

  if (args.length === 1 && args[0] === "--only=tarball") {
    return { onlyTarball: true };
  }

  throw new Error(`Unknown arguments: ${args.join(" ")}`);
}

function runCli() {
  let options;

  try {
    options = parseCliArguments(process.argv.slice(2));
  } catch (error) {
    console.error(`Skill validation failed: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const report = validateRepository(rootDir, options);

  if (!report.ok) {
    console.error(`Skill validation failed with ${report.errors.length} error(s):`);

    for (const error of report.errors) {
      console.error(`- ${error}`);
    }

    process.exitCode = 1;
    return;
  }

  if (options.onlyTarball) {
    console.log(
      `Package validation passed (${report.details.tarballFiles.length} approved files).`,
    );
    return;
  }

  console.log(
    `Skill validation passed (${report.details.references.definitionCount} references, ${report.details.tarballFiles.length} package files, ${report.details.validationWindow}).`,
  );
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;

if (invokedPath === import.meta.url) {
  runCli();
}
