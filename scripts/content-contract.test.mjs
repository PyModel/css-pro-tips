import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadCanonicalContent, renderArtifacts } from "./build-skill.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const content = loadCanonicalContent(ROOT);
const body = (id) => {
  const module = content.modules.find((entry) => entry.id === id);
  assert.ok(module, `Missing module: ${id}`);
  return module.body;
};
const codeBlocks = (markdown, language) => [
  ...markdown.matchAll(new RegExp("```" + language + "\\r?\\n([\\s\\S]*?)\\r?\\n```", "g")),
].map((match) => match[1]);

// These are documentation regression checks, not browser accessibility tests.
test("execution contract exposes all five sections in order", () => {
  const policy = body("operating-policy");
  const headings = [
    "## 1. Overview & Execution Contract",
    "## 2. Input Schema & Parameter Validation",
    "## 3. Deterministic Execution Workflow",
    "## 4. Verification & Acceptance Criteria",
    "## 5. Failure Recovery & Triage Protocol",
  ];
  let previous = -1;
  for (const heading of headings) {
    const position = policy.indexOf(heading);
    assert.ok(position > previous, `Missing or out-of-order heading: ${heading}`);
    previous = position;
  }
  for (const phase of ["Pre-Execution Validation", "Core Execution", "Post-Execution Confirmation"]) {
    assert.ok(policy.includes(phase), `Missing phase: ${phase}`);
  }
});

test("execution contract bounds authority and preserves existing work", () => {
  const policy = body("operating-policy");
  assert.match(policy, /Negative Triggers/);
  assert.match(policy, /\| `mode` \|[^\n]*`review`/);
  assert.match(policy, /\| `allow_dependency_changes` \|[^\n]*`false`/);
  assert.match(policy, /pre-existing changes/);
  assert.match(policy, /symlink/);
  assert.match(policy, /not executed/);
  assert.match(policy, /not a shell API/);
});

test("failure output is parseable and distinguishes blocked work from success", () => {
  const policy = body("operating-policy");
  const reports = codeBlocks(policy, "json").map((block) => JSON.parse(block));
  assert.equal(reports.length, 1, "Keep one canonical result payload");
  const report = reports[0];
  assert.equal(report.status, "BLOCKED");
  assert.equal(report.skill, "css-protips");
  assert.ok(Array.isArray(report.checks));
  assert.ok(Array.isArray(report.changed_files));
  assert.ok(Array.isArray(report.findings));
  assert.ok(Array.isArray(report.unverified));
  assert.equal(report.checks[0].exit_code, null);
  for (const status of ["PASS", "PARTIAL", "BLOCKED", "FAIL"]) {
    assert.ok(policy.includes(status), `Missing result state: ${status}`);
  }
});

test("Animate.css stays an optional referenced capability, not a package dependency", () => {
  const motion = body("motion-transitions");
  const capability = content.capabilities.capabilities.find((entry) => entry.id === "animate-css");
  assert.ok(capability);
  assert.equal(capability.concept, "motion-transitions");
  assert.match(motion, /animate__animated animate__fadeIn/);
  assert.match(motion, /--animate-duration/);
  assert.match(motion, /--animate-delay/);
  assert.match(motion, /--animate-repeat/);
  assert.match(motion, /optional reference/);
  const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8"));
  assert.equal(pkg.dependencies?.["animate.css"], undefined);
  assert.equal(pkg.devDependencies?.["animate.css"], undefined);
});

test("animation evidence distinguishes versioned source from live license claims", () => {
  const motion = body("motion-transitions");
  assert.match(motion, /4\.1\.1/);
  assert.match(motion, /2026-09-04/);
  assert.match(motion, /MIT/);
  assert.match(motion, /Hippocratic/);
  for (const id of ["ref-animate-docs", "ref-animate-base", "ref-animate-license", "ref-animate-package"]) {
    assert.ok(motion.includes(`[${id}]`), `Missing source usage: ${id}`);
    assert.ok(content.sources.has(id), `Missing source record: ${id}`);
  }
  for (const id of ["ref-animate-base", "ref-animate-license", "ref-animate-package"]) {
    assert.match(content.sources.get(id).url, /\/4aa415199dd4ed7d877d10343e745e8bbb4b7a0c\//);
  }
});

test("motion guidance covers cancellation, reduced motion, and semantic disclosure", () => {
  const motion = body("motion-transitions");
  assert.match(motion, /animationcancel/);
  assert.match(motion, /event\.target/);
  assert.match(motion, /event\.animationName/);
  assert.match(motion, /timeout/);
  assert.match(motion, /inert/);
  assert.match(motion, /<details/);
  const css = codeBlocks(motion, "css").join("\n");
  assert.match(css, /prefers-reduced-motion: no-preference/);
  assert.match(css, /animation: none !important/);
  assert.match(css, /animation-delay: 0s !important/);
  assert.match(css, /transition-delay: 0s !important/);
  assert.doesNotMatch(css, /(?:transition|animation)-duration:\s*0\.01ms/);
});

test("vendor import is top-level before blocks and cascade caveats survive", () => {
  const architecture = body("architecture");
  const css = codeBlocks(architecture, "css").find((block) => block.includes("layer(vendor)"));
  assert.ok(css, "Missing layered vendor import example");
  const importPosition = css.indexOf('@import url("vendor.css") layer(vendor);');
  assert.ok(importPosition >= 0);
  assert.ok(importPosition < css.indexOf("{"), "@import must precede all blocks");
  assert.doesNotMatch(css, /@layer\s+vendor\s*\{\s*@import/);
  assert.match(architecture, /normal declarations/);
  assert.match(architecture, /unlayered/);
  assert.match(architecture, /!important/);
});

test("new guidance remains in the generated single-file installation", () => {
  const artifacts = renderArtifacts(ROOT);
  const skill = artifacts["SKILL.md"];
  for (const id of ["operating-policy", "architecture", "motion-transitions"]) {
    assert.ok(skill.includes(body(id)), `Module omitted from installed artifact: ${id}`);
  }
  assert.equal(readFileSync(resolve(ROOT, "SKILL.md"), "utf8"), skill);
  assert.deepEqual(renderArtifacts(ROOT), artifacts, "Rendering must be deterministic");
});
