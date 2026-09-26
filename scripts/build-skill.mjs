import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, posix, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseDocument } from "yaml";
import { deriveValidationWindow, statusLabel } from "./claim-contract.mjs";

const CONTENT_DIR = "content";
const REFERENCE_PATTERN = /\[(ref-[a-z0-9]+(?:-[a-z0-9]+)*)\]/g;

function fail(message) {
  throw new Error(message);
}

function safeRelativePath(value, label) {
  if (
    typeof value !== "string" ||
    value === "" ||
    isAbsolute(value) ||
    value.includes("\\") ||
    posix.normalize(value) !== value ||
    value === ".." ||
    value.startsWith("../")
  ) {
    fail(`${label} must be a safe repository-relative path.`);
  }

  return value;
}

function readText(rootDir, relativePath) {
  const path = join(rootDir, safeRelativePath(relativePath, "Path"));

  try {
    return readFileSync(path, "utf8");
  } catch (error) {
    fail(`${relativePath} could not be read: ${error.message}`);
  }
}

function parseYaml(rootDir, relativePath) {
  const document = parseDocument(readText(rootDir, relativePath), {
    prettyErrors: true,
    strict: true,
    uniqueKeys: true,
  });

  if (document.errors.length > 0) {
    fail(
      `${relativePath} contains invalid YAML: ${document.errors
        .map((error) => error.message)
        .join("; ")}`,
    );
  }

  try {
    return document.toJS({ maxAliasCount: 10 });
  } catch (error) {
    fail(`${relativePath} could not be resolved: ${error.message}`);
  }
}

function parseModule(rootDir, relativePath) {
  const source = readText(rootDir, relativePath);
  const lines = source.split(/\r?\n/);

  if (lines[0] !== "---") {
    fail(`${relativePath} must begin with YAML frontmatter.`);
  }

  const closingIndex = lines.indexOf("---", 1);

  if (closingIndex === -1) {
    fail(`${relativePath} YAML frontmatter is missing its closing delimiter.`);
  }

  const document = parseDocument(lines.slice(1, closingIndex).join("\n"), {
    prettyErrors: true,
    strict: true,
    uniqueKeys: true,
  });

  if (document.errors.length > 0) {
    fail(
      `${relativePath} contains invalid YAML frontmatter: ${document.errors
        .map((error) => error.message)
        .join("; ")}`,
    );
  }

  let metadata;

  try {
    metadata = document.toJS({ maxAliasCount: 10 });
  } catch (error) {
    fail(`${relativePath} frontmatter could not be resolved: ${error.message}`);
  }

  return { body: lines.slice(closingIndex + 1).join("\n").trim(), metadata, relativePath };
}

function requireObject(value, label) {
  if (value === null || Array.isArray(value) || typeof value !== "object") {
    fail(`${label} must be an object.`);
  }

  return value;
}

function requireArray(value, label) {
  if (!Array.isArray(value)) {
    fail(`${label} must be an array.`);
  }

  return value;
}

function sourceMap(sources) {
  const map = new Map();

  for (const source of requireArray(sources, "evidence.sources")) {
    requireObject(source, "evidence.sources entry");

    if (typeof source.id !== "string" || !/^ref-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.id)) {
      fail("Every evidence source requires a ref-* id.");
    }

    if (map.has(source.id)) {
      fail(`Evidence source ${source.id} is duplicated.`);
    }

    if (typeof source.title !== "string" || source.title.trim() === "") {
      fail(`Evidence source ${source.id} requires a title.`);
    }

    if (typeof source.url !== "string" || !/^https?:\/\//.test(source.url)) {
      fail(`Evidence source ${source.id} requires an http(s) URL.`);
    }

    map.set(source.id, source);
  }

  return map;
}

function normalizeCanonicalContent(rootDir) {
  const manifest = requireObject(parseYaml(rootDir, `${CONTENT_DIR}/manifest.yml`), "manifest");
  const policies = requireObject(parseYaml(rootDir, `${CONTENT_DIR}/policies.yml`), "policies");
  const capabilities = requireObject(
    parseYaml(rootDir, `${CONTENT_DIR}/capabilities.yml`),
    "capabilities",
  );
  const evidence = requireObject(parseYaml(rootDir, `${CONTENT_DIR}/evidence.yml`), "evidence");
  const moduleEntries = requireArray(manifest.modules, "manifest.modules");
  const modules = moduleEntries.map((entry) => {
    requireObject(entry, "manifest.modules entry");
    safeRelativePath(entry.path, "Module path");
    return { ...entry, ...parseModule(rootDir, `${CONTENT_DIR}/${entry.path}`) };
  });

  return {
    manifest,
    policies,
    capabilities,
    evidence,
    modules,
    sources: sourceMap(evidence.sources),
  };
}

function collectReferenceIds(markdown) {
  const ids = new Set();
  let match;

  while ((match = REFERENCE_PATTERN.exec(markdown)) !== null) {
    ids.add(match[1]);
  }

  REFERENCE_PATTERN.lastIndex = 0;
  return ids;
}

function referenceLinks(sourceIds, sources) {
  if (!Array.isArray(sourceIds) || sourceIds.length === 0) {
    fail("Every compatibility claim requires at least one source id.");
  }

  return sourceIds
    .map((sourceId) => {
      const source = sources.get(sourceId);

      if (!source) {
        fail(`Claim references unknown source ${sourceId}.`);
      }

      return `[${source.title}][${sourceId}]`;
    })
    .join(" ");
}

function displayName(value) {
  return value
    .replaceAll("-", " ")
    .replace(/\b[a-z]/g, (character) => character.toUpperCase());
}

function markdownCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function yamlString(value) {
  return JSON.stringify(value);
}

function renderReferenceDefinitions(referenceIds, sources) {
  return [...referenceIds]
    .sort()
    .map((id) => {
      const source = sources.get(id);

      if (!source) {
        fail(`Rendered content references unknown source ${id}.`);
      }

      return `[${id}]: ${source.url}`;
    })
    .join("\n");
}


function renderCompatibilityQuickReference(content) {
  const claims = requireArray(content.evidence.claims, "evidence.claims");
  const sections = ["widely", "newly", "limited", "watchlist"];
  const lines = [
    "# Compatibility quick reference",
    "",
    "This is a generated navigation projection. Choose the relevant decision module first; use this table to verify the browser-floor and fallback constraint.",
  ];

  for (const status of sections) {
    const matching = claims
      .filter((claim) => claim.status === status)
      .sort((left, right) => left.id.localeCompare(right.id));

    if (matching.length === 0) {
      continue;
    }

    lines.push("", `## ${statusLabel(status)}`, "", "| Capability | Fallback | Evidence |", "|---|---|---|");

    for (const claim of matching) {
      lines.push(
        `| ${markdownCell(displayName(claim.id))} | ${markdownCell(claim.fallback)} | ${referenceLinks(
          claim.source_ids,
          content.sources,
        )} |`,
      );
    }
  }

  return lines.join("\n");
}

function renderEvidenceIndex(content) {
  const claims = requireArray(content.evidence.claims, "evidence.claims")
    .slice()
    .sort((left, right) => left.id.localeCompare(right.id));
  const lines = [
    "# CSS Pro-Tips evidence index",
    "",
    "Generated from `content/evidence.yml`. Edit canonical content, then run `npm run build`.",
    "",
    "## Compatibility claims",
    "",
    "| Claim | Status | Reviewed | Next review | Fallback | Sources |",
    "|---|---|---|---|---|---|",
  ];

  for (const claim of claims) {
    lines.push(
      `| ${markdownCell(claim.id)} | ${markdownCell(statusLabel(claim.status))} | ${markdownCell(
        claim.reviewed_at,
      )} | ${markdownCell(claim.next_review_at || "—")} | ${markdownCell(
        claim.fallback,
      )} | ${referenceLinks(claim.source_ids, content.sources)} |`,
    );
  }

  lines.push("", "## Sources", "", "| ID | Source | URL |", "|---|---|---|");

  for (const source of [...content.sources.values()].sort((left, right) => left.id.localeCompare(right.id))) {
    lines.push(`| ${source.id} | ${markdownCell(source.title)} | ${source.url} |`);
  }

  return withSourceIndex(lines.join("\n"), content.sources);
}

function renderCompatibilitySummary(content) {
  return withSourceIndex(renderCompatibilityQuickReference(content), content.sources);
}

const GENERATED_NOTICE = "<!-- Generated from content/. Edit canonical files and run npm run build. -->";
const REFERENCE_DIR = "references";

function referencePath(moduleId) {
  return `${REFERENCE_DIR}/${moduleId}.md`;
}

function renderCapabilityGuidance(content, concept) {
  const capabilities = requireArray(content.capabilities.capabilities, "capabilities.capabilities").filter(
    (capability) => capability.concept === concept,
  );

  if (capabilities.length === 0) {
    return "";
  }

  const lines = ["## Capability guidance"];

  for (const capability of capabilities) {
    lines.push(
      "",
      `### ${displayName(capability.id)}`,
      "",
      `- **Recommendation:** ${markdownCell(capability.recommendation)}`,
      `- **Use when:** ${markdownCell(capability.use_when)}`,
      `- **Avoid when:** ${markdownCell(capability.avoid_when)}`,
      `- **Fallback:** ${markdownCell(capability.fallback)}`,
    );

    if (Array.isArray(capability.accessibility_checks) && capability.accessibility_checks.length > 0) {
      lines.push(`- **Accessibility checks:** ${markdownCell(capability.accessibility_checks.join(", "))}`);
    }

    if (capability.performance_notes && capability.performance_notes !== "None direct.") {
      lines.push(`- **Performance:** ${markdownCell(capability.performance_notes)}`);
    }
  }

  return lines.join("\n");
}

function withSourceIndex(markdown, sources) {
  const references = renderReferenceDefinitions(collectReferenceIds(markdown), sources);
  return references === "" ? markdown : `${markdown}\n\n# Reference index\n\n${references}`;
}

function finalize(sections) {
  return sections.filter((section) => section !== "").join("\n\n").replaceAll("\n\n\n\n", "\n\n") + "\n";
}

function referenceModules(content) {
  return content.modules.filter((module) => module.metadata?.type !== "policy");
}

function renderReference(content, module, validationWindow) {
  const body = [
    module.body.replaceAll("{validation_window}", validationWindow),
    renderCapabilityGuidance(content, module.id),
  ]
    .filter((section) => section !== "")
    .join("\n\n");

  return finalize([GENERATED_NOTICE, withSourceIndex(body, content.sources)]);
}

function renderLoadOnDemand(content) {
  const lines = [
    "## Load on demand",
    "",
    "Read only the references the task touches; most tasks need one or two. Paths are relative to this skill's directory.",
    "",
    "| Reference | Read when |",
    "|---|---|",
  ];

  for (const module of referenceModules(content)) {
    if (typeof module.metadata.read_when !== "string" || module.metadata.read_when.trim() === "") {
      fail(`${module.relativePath} requires a read_when string.`);
    }

    lines.push(`| [\`${referencePath(module.id)}\`](${referencePath(module.id)}) | ${markdownCell(module.metadata.read_when)} |`);
  }

  const { compatibility_summary: compatibility, policies } = content.manifest.artifacts;
  lines.push(
    `| [\`${compatibility}\`](${compatibility}) | Checking a feature's Baseline status, browser floor, or required fallback. |`,
    `| [\`${policies}\`](${policies}) | Justifying or verifying a standing policy (rule, exceptions, verification). |`,
  );

  return lines.join("\n");
}

function renderPolicyCommitments(content) {
  const lines = [
    "# Policy commitments",
    "",
    "Generated from `content/policies.yml`. A policy is a standing engineering commitment: apply it before implementation and verify it after.",
  ];

  for (const policy of requireArray(content.policies.policies, "policies.policies")) {
    lines.push(
      "",
      `## ${displayName(policy.id)} (${policy.strength})`,
      "",
      `- **Rule:** ${markdownCell(policy.rule)}`,
      `- **Applies when:** ${markdownCell(policy.applies_when)}`,
      `- **Exceptions:** ${markdownCell(policy.exceptions)}`,
      `- **Verification:** ${markdownCell(policy.verification)}`,
    );
  }

  return finalize([GENERATED_NOTICE, withSourceIndex(lines.join("\n"), content.sources)]);
}

function renderSkill(content, validationWindow) {
  const skill = requireObject(content.manifest.skill, "manifest.skill");

  if (typeof skill.name !== "string" || typeof skill.description !== "string") {
    fail("manifest.skill requires name and description strings.");
  }

  const routers = content.modules.filter((module) => module.metadata?.type === "policy");

  if (routers.length !== 1) {
    fail(`Exactly one policy module must own SKILL.md; found ${routers.length}.`);
  }

  const body = [routers[0].body.replaceAll("{validation_window}", validationWindow), renderLoadOnDemand(content)].join(
    "\n\n",
  );

  return finalize([
    ["---", `name: ${yamlString(skill.name)}`, `description: ${yamlString(skill.description)}`, "---", "", GENERATED_NOTICE].join("\n"),
    withSourceIndex(body, content.sources),
  ]);
}

export function loadCanonicalContent(rootDir) {
  return normalizeCanonicalContent(resolve(rootDir));
}

export function renderArtifacts(rootDir) {
  const content = loadCanonicalContent(rootDir);
  const validationWindow = deriveValidationWindow(content.evidence);
  const { artifacts } = content.manifest;
  const output = {
    [artifacts.skill]: renderSkill(content, validationWindow),
    [artifacts.policies]: renderPolicyCommitments(content),
    [artifacts.compatibility_summary]: renderCompatibilitySummary(content),
    [artifacts.evidence_index]: renderEvidenceIndex(content),
  };

  for (const module of referenceModules(content)) {
    output[referencePath(module.id)] = renderReference(content, module, validationWindow);
  }

  return output;
}

export function buildArtifacts(rootDir) {
  const resolvedRoot = resolve(rootDir);
  const artifacts = renderArtifacts(resolvedRoot);

  for (const [relativePath, output] of Object.entries(artifacts)) {
    const target = join(resolvedRoot, safeRelativePath(relativePath, "Artifact path"));
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, output, "utf8");
  }

  return Object.keys(artifacts);
}

function runCli() {
  if (process.argv.length > 2) {
    throw new Error(`Unknown arguments: ${process.argv.slice(2).join(" ")}`);
  }

  const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const artifacts = buildArtifacts(rootDir);
  console.log(`Built ${artifacts.join(", ")}.`);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;

if (invokedPath === import.meta.url) {
  try {
    runCli();
  } catch (error) {
    console.error(`Skill build failed: ${error.message}`);
    process.exitCode = 1;
  }
}
