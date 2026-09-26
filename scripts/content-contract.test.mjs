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
// The execution contract spans the always-loaded router and its on-demand detail.
const contract = () => `${body("operating-policy")}\n${body("execution-contract")}`;
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
  const policy = contract();
  assert.match(policy, /Negative Triggers/);
  assert.match(policy, /\| `mode` \|[^\n]*`review`/);
  assert.match(policy, /\| `allow_dependency_changes` \|[^\n]*`false`/);
  assert.match(policy, /pre-existing changes/);
  assert.match(policy, /symlink/);
  assert.match(policy, /not executed/);
  assert.match(policy, /not a shell API/);
});

test("failure output is parseable and distinguishes blocked work from success", () => {
  const policy = contract();
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

test("router links every reference and each module lands in exactly its reference", () => {
  const artifacts = renderArtifacts(ROOT);
  const skill = artifacts["SKILL.md"];
  assert.ok(skill.includes(body("operating-policy").replaceAll("{validation_window}", "September 2026")));
  const references = Object.keys(artifacts).filter((path) => path.startsWith("references/"));
  assert.ok(references.length > 0);
  for (const path of references) {
    assert.ok(skill.includes(`](${path})`), `SKILL.md does not link ${path}`);
  }
  for (const module of content.modules.filter((entry) => entry.metadata.type === "concept")) {
    const path = `references/${module.id}.md`;
    assert.ok(artifacts[path]?.includes(module.body), `Module missing from ${path}`);
    assert.ok(!skill.includes(module.body), `Module ${module.id} leaked into SKILL.md`);
  }
  for (const [path, output] of Object.entries(artifacts)) {
    assert.equal(readFileSync(resolve(ROOT, path), "utf8"), output, `${path} is stale`);
  }
  assert.deepEqual(renderArtifacts(ROOT), artifacts, "Rendering must be deterministic");
});

test("target validation separates workspace paths from supplied snippets", () => {
  const policy = contract();
  const targets = policy.split("\n").find((line) => line.startsWith("| `targets` |"));
  assert.ok(targets, "Missing targets schema row");
  assert.match(targets, /Path targets:/);
  assert.match(targets, /resolve paths and symlinks inside the authorized workspace/);
  assert.match(targets, /exists or is an explicitly requested new file/);
  assert.match(targets, /No traversal, unrelated files, or arbitrary remote URLs as paths/);
  assert.match(targets, /Snippet targets:/);
  assert.match(targets, /non-empty supplied source/);
  assert.match(targets, /workspace, symlink, and existence checks do not apply/);
});

test("review payload and finalization do not require project mutation", () => {
  const policy = body("operating-policy");
  const payload = policy.split("\n").find((line) => line.includes("**Execution Payload:**"));
  assert.ok(payload, "Missing execution payload");
  assert.match(payload, /For `review`, provide findings and evidence only/);
  assert.match(payload, /do not change project files or run mutating build\/fix scripts/);
  assert.match(payload, /For `implement` and `refactor`, provide a scoped file patch/);
  assert.match(payload, /In edit modes in \*\*this skill repository only\*\*/);
  const postExecution = policy.split("### Phase 3: Post-Execution Confirmation")[1]
    .split("## 4. Verification & Acceptance Criteria")[0];
  assert.match(postExecution, /For review mode, confirm project files match the recorded baseline/);
  assert.match(postExecution, /do not regenerate output/);
});

test("normal-motion feedback preserves Animate.css delay and repetition helpers", () => {
  const css = codeBlocks(body("motion-transitions"), "css").join("\n");
  const feedbackRule = css.match(/\.feedback\.animate__animated\s*\{([^}]+)\}/)?.[1];
  assert.ok(feedbackRule, "Missing normal-motion feedback rule");
  assert.match(feedbackRule, /--animate-duration:/);
  assert.doesNotMatch(feedbackRule, /--animate-(?:delay|repeat)\s*:/);
  assert.doesNotMatch(feedbackRule, /animation-(?:delay|iteration-count)\s*:/);
  assert.match(css, /@media print, \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation: none !important/);
  assert.match(css, /animation-delay: 0s !important/);
});

test("module prose does not contradict claim support levels", () => {
  const contradictions = [];
  const downgradePhrase = /\b(?:watchlist\s+only|enhancement\s+only|cosmetic|decorative\s+geometry\s+is\s+optional|Use\s+only\s+when|treat\s+as\s+optional|is\s+cosmetic)\b/i;
  const downgradingLines = new Map();

  for (const module of content.modules) {
    for (const line of module.body.split("\n")) {
      if (downgradePhrase.test(line)) {
        downgradingLines.set(module.relativePath + ":" + line.trim(), line);
      }
    }
  }

  for (const claim of content.evidence.claims) {
    const tokens = claim.feature_tokens;
    if (!Array.isArray(tokens) || !["widely", "newly"].includes(claim.status)) {
      continue;
    }

    for (const line of downgradingLines.values()) {
      if (tokens.some((token) => line.includes(token))) {
        contradictions.push(`${claim.id} is ${claim.status}, but a module names it on a downgrading line: ${line.trim()}`);
      }
    }
  }

  assert.deepEqual(contradictions, []);
});

test("each agent-facing file ships at most one reference index", () => {
  for (const [path, output] of Object.entries(renderArtifacts(ROOT))) {
    const matches = output.match(/^# Reference index$/gm) || [];
    assert.ok(matches.length <= 1, `${path} has ${matches.length} reference indexes`);
  }
});

test("contract detail lives only in its on-demand reference", () => {
  const artifacts = renderArtifacts(ROOT);
  const skill = artifacts["SKILL.md"];
  const detail = artifacts["references/execution-contract.md"];
  assert.ok(skill.includes("](references/execution-contract.md)"), "Router must link the contract detail");
  assert.doesNotMatch(skill, /^\| `mode` \|/m, "Input schema table leaked into SKILL.md");
  assert.doesNotMatch(skill, /^\| Trigger \|/m, "Triage table leaked into SKILL.md");
  assert.equal(codeBlocks(skill, "json").length, 0, "Escalation JSON leaked into SKILL.md");
  assert.equal(codeBlocks(detail, "json").length, 1);
  const rollbackOwners = Object.entries(artifacts).filter(([, output]) => output.includes("For uncommitted edits"));
  assert.deepEqual(rollbackOwners.map(([path]) => path), ["SKILL.md"], "Rollback rules must have one owner");
});

// SKILL.md loads on every activation; references load on demand. The ceilings track
// the Skill Grader corpus (p90 body ~2,200 words) so the router cannot regrow into a monolith.
test("router stays within the per-activation budget", () => {
  const MAX_ROUTER_WORDS = 1600;
  const MAX_ROUTER_HEADINGS = 15;
  const skill = renderArtifacts(ROOT)["SKILL.md"];
  const prose = skill.replace(/```[\s\S]*?```/g, "");
  const words = prose.split(/\s+/).filter(Boolean).length;
  const headings = (prose.match(/^#{1,6} /gm) || []).length;
  assert.ok(words <= MAX_ROUTER_WORDS, `SKILL.md has ${words} words; move detail into references/.`);
  assert.ok(headings <= MAX_ROUTER_HEADINGS, `SKILL.md has ${headings} headings; move sections into references/.`);
});
