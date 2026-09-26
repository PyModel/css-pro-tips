---
id: execution-contract
type: contract
title: Execution contract detail
read_when: "Validating task inputs (mode, targets, dependencies, verification), triaging a failure, or writing a PARTIAL/BLOCKED/FAIL report."
policy_ids: []
capability_ids: []
---

# Execution contract detail

This expands sections 2 and 5 of `SKILL.md`. The contract there still governs; this file supplies the exact rules.

## Input schema

These are normalized task inputs, **not a shell API**.

| Parameter | Type | Required | Default | Validation Rule / Allowed Values |
|---|---|---|---|---|
| `mode` | Enum | No | `review` | `review`, `implement`, `refactor`; only explicit edit requests permit the latter two. Review produces findings without changing project files. |
| `targets` | Array of paths or supplied snippets | Yes | Discovered requested scope | Non-empty. Path targets: resolve paths and symlinks inside the authorized workspace; verify each path exists or is an explicitly requested new file. No traversal, unrelated files, or arbitrary remote URLs as paths. Snippet targets: require non-empty supplied source and record its source label; workspace, symlink, and existence checks do not apply. |
| `browser_targets` | Array of engine/version targets or `unknown` | No | Inspected product configuration | Never invent versions or treat Baseline as the product floor. If unknown, retain a usable fallback and report unverified compatibility. |
| `motion_strategy` | Enum | No | `auto` | `auto`, `none`, `native`, `animate-css`; auto prefers existing/native CSS. A forced library choice still requires dependency permission. |
| `allow_dependency_changes` | Boolean | No | `false` | Only literal true/false; true requires explicit authorization. Check lockfile, existing version, license, and import owner before adding or upgrading. |
| `verification` | Enum | No | `auto` | `auto`, `static`, `browser`; auto uses browser checks for behavior/visual edits and static checks for review. Static-only evidence cannot prove browser behavior. |

## Failure triage

| Trigger | Diagnostic Step | Mitigation / Rollback |
|---|---|---|
| Invalid input, path escape, or permission mismatch | Compare resolved target, workspace root, symlink destination, and requested mode. | Stop before mutation; report the invalid field and safe scope. |
| Build, lint, or regression failure | Capture exact command/exit code and first actionable diagnostic; compare with baseline. | Correct or reverse only this task's faulty change, then rerun the failed gate. No blind retries or disabled tests. |
| Motion hides content, blocks focus, or never settles | Inspect computed animation names, delays, iterations, reduced-motion state, and lifecycle cleanup. | Restore the usable static state; cancel task-owned listeners/timers; keep the effect disabled until verified. |
| Missing browser/tool/network or conflicting evidence | Record the missing prerequisite or conflicting primary sources. | Continue safe independent work; mark remaining checks unverified and return PARTIAL/BLOCKED rather than claiming completion. |
| Dependency or import regression | Inspect the exact installed artifact, lockfile diff, license, cascade, and duplicate imports. | Restore this task's manifest/lockfile/import changes together; use the native/static fallback. Do not remove an existing shared dependency. |

Rollback rules are in `SKILL.md` section 5.

## Escalation output

**Escalation Output:** Use this shape with actual evidence, redacted diagnostics, and no secrets. `exit_code` is null when a command was not executed; `changed_files` contains actual paths, not intended ones.

```json
{
  "skill": "css-protips",
  "status": "BLOCKED",
  "phase": "post-execution",
  "reason": "Required browser verification is unavailable.",
  "changed_files": [],
  "checks": [
    { "name": "reduced-motion interaction", "status": "NOT_RUN", "command": null, "exit_code": null, "evidence": null }
  ],
  "findings": [],
  "unverified": ["Target-browser behavior"],
  "rollback": "No project files changed.",
  "next_action": "Run the recorded browser checks in the target environment."
}
```
