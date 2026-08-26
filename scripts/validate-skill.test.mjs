import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateRepository, validateTarballFileSet } from "./validate-skill.mjs";

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const APPROVED_FILES = Object.freeze([
  "CHANGELOG.md",
  "LICENSE",
  "README.md",
  "SKILL.md",
  "assets/banner.svg",
  "package.json",
]);
const PACKAGE_SCRIPTS = Object.freeze({
  test: "node --test scripts/validate-skill.test.mjs && npm run validate",
  validate: "node scripts/validate-skill.mjs",
  "pack:check": "node scripts/validate-skill.mjs --only=tarball",
});

const VALID_SKILL = `---
name: css-protips
description: Use when writing or reviewing source-validated CSS guidance.
---

# CSS Protips

Statuses in this file were verified against sources in **August 2026**.

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

function createFixture(overrides = {}) {
  const rootDir = mkdtempSync(join(tmpdir(), "css-pro-tips-validator-"));
  const packageJson = {
    name: "css-pro-tips",
    version: "1.2.0",
    files: APPROVED_FILES.filter((path) => path !== "package.json"),
    scripts: PACKAGE_SCRIPTS,
    ...overrides.packageJson,
  };
  const files = {
    "CHANGELOG.md": VALID_CHANGELOG,
    "LICENSE": "MIT\n",
    "README.md": VALID_README,
    "SKILL.md": VALID_SKILL,
    "assets/banner.svg": "<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>\n",
    "package.json": `${JSON.stringify(packageJson, null, 2)}\n`,
    ...overrides.files,
  };

  for (const [relativePath, content] of Object.entries(files)) {
    const absolutePath = join(rootDir, relativePath);
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, content);
  }

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

test("accepts a valid monolithic skill without freezing its headings", (t) => {
  const rootDir = withFixture(t);
  const report = validateRepository(rootDir, { includeTarball: false });

  assert.equal(report.ok, true, messages(report));
  assert.equal(report.details.references.definitionCount, 1);
  assert.equal(report.details.validationWindow, "August 2026");
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
    const boundaryFrontmatter = VALID_SKILL
      .replace("name: css-protips", `name: ${"a".repeat(64)}`)
      .replace(
        "description: Use when writing or reviewing source-validated CSS guidance.",
        `description: ${"a".repeat(1024)}`,
      );
    const rootDir = withFixture(t, { files: { "SKILL.md": boundaryFrontmatter } });
    const report = validateRepository(rootDir, { includeTarball: false });

    assert.equal(report.ok, true, messages(report));
  });

  await t.test("rejects values over the limits", (t) => {
    const oversizedFrontmatter = VALID_SKILL
      .replace("name: css-protips", `name: ${"a".repeat(65)}`)
      .replace(
        "description: Use when writing or reviewing source-validated CSS guidance.",
        `description: ${"a".repeat(1025)}`,
      );
    const rootDir = withFixture(t, { files: { "SKILL.md": oversizedFrontmatter } });
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
      "SKILL.md": VALID_SKILL.replace(" and `@utility`", ""),
    },
  });
  const report = validateRepository(rootDir, { includeTarball: false });
  const output = messages(report);

  assert.equal(report.ok, false);
  assert.match(output, /Validation-window drift/);
  assert.match(output, /current release does not mention validation window August 2026/);
  assert.match(output, /stable capability "Tailwind mapping": @utility/);
});

test("rejects package allowlist drift", (t) => {
  const approved = APPROVED_FILES.filter((path) => path !== "package.json");
  const rootDir = withFixture(t, {
    packageJson: { files: [...approved, "scripts/release.mjs"] },
  });
  const report = validateRepository(rootDir, { includeTarball: false });
  const output = messages(report);

  assert.equal(report.ok, false);
  assert.match(output, /files contains unapproved paths: scripts\/release\.mjs/);
});

test("rejects missing and unexpected tarball files", () => {
  const errors = [];
  const actualFiles = APPROVED_FILES.filter((path) => path !== "LICENSE");
  actualFiles.push("scripts/release.mjs");

  validateTarballFileSet(actualFiles, errors);

  assert.match(errors.join("\n"), /missing approved files: LICENSE/);
  assert.match(errors.join("\n"), /contains unapproved files: scripts\/release\.mjs/);
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
      /Skill validation passed \(\d+ references, 6 package files, [A-Z][a-z]+ \d{4}\)\./,
    );
  },
);
