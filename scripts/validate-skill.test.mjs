import "./content-contract.test.mjs";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildArtifacts } from "./build-skill.mjs";
import { validateRepository, validateTarballFileSet } from "./validate-skill.mjs";

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGE_FILES = Object.freeze(["CHANGELOG.md", "LICENSE", "README.md", "SKILL.md", "assets/banner.svg", "references"]);
const TARBALL_FILES = Object.freeze([
  "CHANGELOG.md",
  "LICENSE",
  "README.md",
  "SKILL.md",
  "assets/banner.svg",
  "package.json",
  "references/compatibility.md",
  "references/policies.md",
]);
const PACKAGE_SCRIPTS = Object.freeze({
  build: "node scripts/build-skill.mjs",
  test: "node --test scripts/validate-skill.test.mjs && npm run validate",
  validate: "node scripts/validate-skill.mjs",
  "pack:check": "node scripts/validate-skill.mjs --only=tarball",
});

const VALID_SKILL = `---
name: css-protips
description: Use when writing or reviewing source-validated CSS guidance.
---

# CSS Protips

Compatibility statuses in this skill were verified against sources in **August 2026**.

Compatibility follows MDN Baseline. Widely available features may ship normally;
Limited availability features require progressive enhancement.

A working fallback comes first, then an enhancement guarded with \`@supports\`.

\`\`\`css
.card {
  display: grid;
}
\`\`\`

Honor \`prefers-reduced-motion\` and \`forced-colors\`.
Tailwind v4 maps the same guidance through \`@theme\` and \`@utility\`.

Source: [MDN][ref-mdn].

[ref-mdn]: https://developer.mozilla.org/
`;

const VALID_README = `# CSS Protips

- Package version: [\`1.2.0\`](./package.json)
- Last validation window: August 2026
`;

const VALID_CHANGELOG = `# Changelog

## [1.2.0] - 2026-08-21

Statuses reverified in August 2026.
`;

function canonicalFixture({
  skillDescription = "Use when writing or reviewing source-validated CSS guidance.",
  skillName = "css-protips",
} = {}) {
  return {
    "content/manifest.yml": `schema_version: 1
skill:
  name: ${JSON.stringify(skillName)}
  description: ${JSON.stringify(skillDescription)}
artifacts:
  skill: SKILL.md
  compatibility_summary: references/compatibility.md
  evidence_index: docs/evidence-index.md
  policies: references/policies.md
modules:
  - id: operating-policy
    path: modules/00-operating-policy.md
`,
    "content/policies.yml": `schema_version: 1
policies:
  - id: static-css-first
    strength: strong-default
    rule: Prefer static CSS.
    applies_when: Writing component CSS.
    exceptions: A documented runtime-only styling need.
    verification: Confirm static CSS can express the state.
`,
    "content/capabilities.yml": `schema_version: 1
capabilities:
  - id: static-css
    concept: operating-policy
    recommendation: Prefer static CSS.
    use_when: Styling a component.
    avoid_when: Runtime CSS is unnecessary.
    fallback: Static class variants.
    accessibility_checks: []
    performance_notes: Static output is cacheable.
`,
    "content/evidence.yml": `schema_version: 1
sources:
  - id: ref-mdn
    title: MDN
    url: https://developer.mozilla.org/
claims:
  - id: static-css
    capability_id: static-css
    status: widely
    reviewed_at: August 2026
    source_ids: [ref-mdn]
    feature_tokens: ["static CSS"]
    fallback: Static class variants.
`,
    "content/modules/00-operating-policy.md": `---
id: operating-policy
type: policy
title: Operating policy
policy_ids: [static-css-first]
capability_ids: [static-css]
---

# CSS Protips

Compatibility statuses in this skill were verified against sources in **{validation_window}**.

Compatibility follows MDN Baseline. Widely available features may ship normally;
Limited availability features require progressive enhancement.

A working fallback comes first, then an enhancement guarded with \`@supports\`.

\`\`\`css
.card {
  display: grid;
}
\`\`\`

Honor \`prefers-reduced-motion\` and \`forced-colors\`.
Tailwind v4 maps the same guidance through \`@theme\` and \`@utility\`.

Source: [MDN][ref-mdn].
`,
  };
}

function writeFiles(rootDir, files) {
  for (const [relativePath, content] of Object.entries(files)) {
    const absolutePath = join(rootDir, relativePath);
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, content);
  }
}

function createFixture(overrides = {}) {
  const rootDir = mkdtempSync(join(tmpdir(), "css-pro-tips-validator-"));
  const packageJson = {
    name: "css-pro-tips",
    version: "1.2.0",
    files: [...PACKAGE_FILES],
    scripts: PACKAGE_SCRIPTS,
    ...overrides.packageJson,
  };
  const files = {
    "CHANGELOG.md": VALID_CHANGELOG,
    "LICENSE": "MIT\n",
    "README.md": VALID_README,
    "assets/banner.svg": "<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>\n",
    "package.json": `${JSON.stringify(packageJson, null, 2)}\n`,
    ...overrides.files,
  };

  writeFiles(rootDir, canonicalFixture(overrides.canonical));
  buildArtifacts(rootDir);
  writeFiles(rootDir, files);

  return rootDir;
}

function withFixture(t, overrides) {
  const rootDir = createFixture(overrides);
  t.after(() => rmSync(rootDir, { force: true, recursive: true }));
  return rootDir;
}

function messages(report) {
  return report.errors.join("\n");
}

test("accepts a valid generated skill without freezing its headings", (t) => {
  const rootDir = withFixture(t);
  const report = validateRepository(rootDir, { includeTarball: false });

  assert.equal(report.ok, true, messages(report));
  // SKILL.md and references/compatibility.md each define ref-mdn.
  assert.equal(report.details.references.definitionCount, 2);
  assert.equal(report.details.validationWindow, "August 2026");
});

test("rejects stale generated artifacts and broken canonical evidence", async (t) => {
  await t.test("stale SKILL.md", (t) => {
    const rootDir = withFixture(t, {
      files: { "SKILL.md": "---\nname: css-protips\ndescription: stale\n---\n" },
    });
    const report = validateRepository(rootDir, { includeTarball: false });

    assert.equal(report.ok, false);
    assert.match(messages(report), /SKILL\.md is stale/);
  });

  await t.test("unknown claim source", (t) => {
    const rootDir = withFixture(t, {
      files: {
        "content/evidence.yml": canonicalFixture()["content/evidence.yml"].replace(
          "source_ids: [ref-mdn]",
          "source_ids: [ref-missing]",
        ),
      },
    });
    const report = validateRepository(rootDir, { includeTarball: false });

    assert.equal(report.ok, false);
    assert.match(messages(report), /unknown source ref-missing/);
  });
});

test("rejects malformed YAML and invalid skill names", async (t) => {
  await t.test("malformed YAML", (t) => {
    const rootDir = withFixture(t, {
      files: { "SKILL.md": VALID_SKILL.replace("name: css-protips", "name: [") },
    });
    const report = validateRepository(rootDir, { includeTarball: false });

    assert.equal(report.ok, false);
    assert.match(messages(report), /invalid YAML frontmatter/);
  });

  await t.test("invalid name", (t) => {
    const rootDir = withFixture(t, {
      files: { "SKILL.md": VALID_SKILL.replace("name: css-protips", "name: CSS_Pro") },
    });
    const report = validateRepository(rootDir, { includeTarball: false });

    assert.equal(report.ok, false);
    assert.match(messages(report), /lowercase letters, numbers, and internal hyphens/);
  });
});

test("enforces Agent Skills frontmatter length limits", async (t) => {
  await t.test("accepts the exact limits", (t) => {
    const rootDir = withFixture(t, {
      canonical: { skillDescription: "a".repeat(1024), skillName: "a".repeat(64) },
    });
    const report = validateRepository(rootDir, { includeTarball: false });

    assert.equal(report.ok, true, messages(report));
  });

  await t.test("rejects values over the limits", (t) => {
    const rootDir = withFixture(t, {
      canonical: { skillDescription: "a".repeat(1025), skillName: "a".repeat(65) },
    });
    const report = validateRepository(rootDir, { includeTarball: false });
    const output = messages(report);

    assert.equal(report.ok, false);
    assert.match(output, /name exceeds 64 characters \(65\)/);
    assert.match(output, /description exceeds 1024 characters \(1025\)/);
  });
});

test("reports duplicate, missing, and unused references together", (t) => {
  const invalidReferences = VALID_SKILL.replace(
    "Source: [MDN][ref-mdn].\n\n[ref-mdn]: https://developer.mozilla.org/",
    `Source: [MDN][ref-mdn], [missing source][ref-missing], and [bad id][ref-Bad ID].

[ref-mdn]: https://developer.mozilla.org/
[ref-mdn]: https://developer.mozilla.org/
[ref-unused]: https://example.com/unused`,
  );
  const rootDir = withFixture(t, { files: { "SKILL.md": invalidReferences } });
  const report = validateRepository(rootDir, { includeTarball: false });
  const output = messages(report);

  assert.equal(report.ok, false);
  assert.match(output, /duplicate reference definition \[ref-mdn\]/);
  assert.match(output, /reference usage \[ref-missing\] has no definition/);
  assert.match(output, /reference identifier \[ref-Bad ID\] must use lowercase/);
  assert.match(output, /reference definition \[ref-unused\] is unused/);
});

test("reports metadata drift and missing stable capabilities", (t) => {
  const rootDir = withFixture(t, {
    files: {
      "CHANGELOG.md": VALID_CHANGELOG.replace("August 2026", "July 2026"),
      "README.md": VALID_README.replace("August 2026", "July 2026"),
      "SKILL.md": VALID_SKILL.replace("August 2026", "October 2026").replace(" and `@utility`", ""),
    },
  });
  const report = validateRepository(rootDir, { includeTarball: false });
  const output = messages(report);

  assert.equal(report.ok, false);
  assert.match(output, /SKILL\.md is stale/);
  assert.match(output, /README\.md validation window July 2026 does not match derived window August 2026\./);
  assert.match(output, /current release does not mention validation window August 2026/);
  assert.match(output, /stable capability "Tailwind mapping": @utility/);
});

test("rejects package allowlist drift", (t) => {
  const rootDir = withFixture(t, {
    packageJson: { files: [...PACKAGE_FILES, "scripts/release.mjs"] },
  });
  const report = validateRepository(rootDir, { includeTarball: false });
  const output = messages(report);

  assert.equal(report.ok, false);
  assert.match(output, /files contains unapproved paths: scripts\/release\.mjs/);
});

test("rejects missing and unexpected tarball files", () => {
  const errors = [];
  const actualFiles = TARBALL_FILES.filter((path) => path !== "LICENSE");
  actualFiles.push("scripts/release.mjs");

  validateTarballFileSet(actualFiles, errors, TARBALL_FILES);

  assert.match(errors.join("\n"), /missing approved files: LICENSE/);
  assert.match(errors.join("\n"), /contains unapproved files: scripts\/release\.mjs/);
});

test("validates references per file and derives the tarball from the build", async (t) => {
  await t.test("broken reference inside a references/ file names that file", (t) => {
    const rootDir = withFixture(t, {
      files: { "references/policies.md": "# Policy commitments\n\nSee [gone][ref-missing].\n" },
    });
    const output = messages(validateRepository(rootDir, { includeTarball: false }));

    assert.match(output, /references\/policies\.md:3 reference usage \[ref-missing\] has no definition/);
    assert.match(output, /references\/policies\.md is stale/);
  });

  await t.test("tarball missing a rendered reference is rejected", (t) => {
    const rootDir = withFixture(t);
    const packed = TARBALL_FILES.filter((path) => path !== "references/compatibility.md");
    const report = validateRepository(rootDir, {
      packRunner: () => ({ status: 0, stdout: JSON.stringify([{ files: packed.map((path) => ({ path })) }]) }),
    });

    assert.match(messages(report), /missing approved files: references\/compatibility\.md/);
  });

  await t.test("references must be a directory entry", (t) => {
    const rootDir = withFixture(t);
    rmSync(join(rootDir, "references"), { force: true, recursive: true });
    writeFileSync(join(rootDir, "references"), "not a directory\n");
    const report = validateRepository(rootDir, { includeTarball: false });

    assert.match(messages(report), /must be a regular directory: references/);
  });
});

test("reference modules must declare read_when", (t) => {
  const canonical = canonicalFixture();
  const rootDir = withFixture(t, {
    files: {
      "content/manifest.yml": canonical["content/manifest.yml"] + "  - id: layout\n    path: modules/01-layout.md\n",
      "content/modules/01-layout.md": "---\nid: layout\ntype: concept\ntitle: Layout\npolicy_ids: []\ncapability_ids: []\n---\n\n# Layout\n",
    },
  });
  const output = messages(validateRepository(rootDir, { includeTarball: false }));

  assert.match(output, /01-layout\.md read_when must be a non-empty string/);
});

test("validation window may be documented under [Unreleased] without rewriting releases", (t) => {
  const rootDir = withFixture(t, {
    files: {
      "CHANGELOG.md": "# Changelog\n\n## [Unreleased]\n\nStatuses refreshed in August 2026.\n\n## [1.2.0] - 2026-08-21\n\nStatuses reverified in July 2026.\n",
    },
  });
  const report = validateRepository(rootDir, { includeTarball: false });

  assert.equal(report.ok, true, messages(report));
});

test("reports npm pack subprocess failures", (t) => {
  const rootDir = withFixture(t);
  const report = validateRepository(rootDir, {
    packRunner: () => ({
      error: undefined,
      status: 2,
      stderr: "forced pack failure",
      stdout: "",
    }),
  });

  assert.equal(report.ok, false);
  assert.match(messages(report), /npm pack exited with status 2: forced pack failure/);
});

test(
  "validates the real package with network access disabled",
  { timeout: 60_000 },
  () => {
    const result = spawnSync(process.execPath, [join(ROOT_DIR, "scripts/validate-skill.mjs")], {
      cwd: ROOT_DIR,
      encoding: "utf8",
      env: {
        ...process.env,
        ALL_PROXY: "http://127.0.0.1:9",
        HTTP_PROXY: "http://127.0.0.1:9",
        HTTPS_PROXY: "http://127.0.0.1:9",
        NO_PROXY: "",
        all_proxy: "http://127.0.0.1:9",
        http_proxy: "http://127.0.0.1:9",
        https_proxy: "http://127.0.0.1:9",
        no_proxy: "",
        npm_config_offline: "true",
      },
      maxBuffer: 1024 * 1024,
      shell: false,
      timeout: 60_000,
      windowsHide: true,
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(
      result.stdout,
      /Skill validation passed \(\d+ references, \d+ package files, [A-Z][a-z]+ \d{4}\)\./,
    );
  },
);
