<p align="center">
  <img src="./assets/banner.svg" alt="CSS Pro-Tips: Baseline-aware CSS guidance for AI coding agents" width="100%">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/css-pro-tips"><img alt="npm version" src="https://img.shields.io/npm/v/css-pro-tips?style=flat&color=14b8a6&labelColor=0f172a"></a>
  <a href="https://www.npmjs.com/package/css-pro-tips"><img alt="npm downloads" src="https://img.shields.io/npm/dt/css-pro-tips?style=flat-square"></a>
  <a href="https://github.com/PyModel/css-pro-tips"><img alt="visitors" src="https://komarev.com/ghpvc/?username=PyModel-css-pro-tips&label=visitors&color=4f46e5&style=flat-square"></a>
  <a href="./LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-f59e0b?style=flat&labelColor=0f172a"></a>
  <a href="https://web.dev/baseline"><img alt="Baseline aware" src="https://img.shields.io/badge/Baseline-aware-84cc16?style=flat&labelColor=0f172a"></a>
  <a href="./SKILL.md"><img alt="SKILL.md format" src="https://img.shields.io/badge/format-SKILL.md-38bdf8?style=flat&labelColor=0f172a"></a>
</p>

<h1 align="center">CSS Pro-Tips</h1>

<p align="center">
  <strong>A source-checked modern CSS skill for AI coding agents.</strong><br>
  Drop one file into Claude Code, Codex, Cursor, Pi, OpenCode, Kiro, or anything else that reads <code>SKILL.md</code>, and the agent writes CSS against what browsers actually support today instead of what was true in 2018.
</p>

<p align="center">
  <a href="#install">Install</a> |
  <a href="#whats-inside">What's inside</a> |
  <a href="#where-the-file-goes">Where the file goes</a> |
  <a href="#verification">Verification</a>
</p>

---

## Why it exists

Ask an agent for CSS and you often get a mix of good habits and museum pieces: float clearfixes, padding-hack aspect ratios, `100vh` that breaks on mobile Safari, blanket resets, hover-only interactions, and experimental properties used with no fallback.

This package gives the agent one reference to check against. Every compatibility claim in it is bucketed by MDN Baseline status and links back to MDN, web.dev, Can I use, or the spec. Features with limited support are wrapped in `@supports` rather than assumed.

## What's inside

One file: [`SKILL.md`](./SKILL.md).

| Layer | What the agent gets | Examples |
|---|---|---|
| Evergreen CSS | Patterns that still hold up | `box-sizing`, `:not()`, `:is()`, `:where()`, `aspect-ratio`, `gap`, logical properties |
| Baseline widely available | Normal production CSS for evergreen targets | `:has()`, container queries, native nesting, `@layer`, `subgrid`, `color-mix()`, `clamp()` |
| Baseline newly available | Useful, but check your audience first | `text-wrap`, `light-dark()`, `@scope`, `@starting-style`, anchor positioning, `field-sizing`, container style queries, `:open`, `text-box-trim` |
| Limited availability | Enhancement only, never load-bearing | `accent-color`, scroll-driven animations, `interpolate-size`, `calc-size()`, typed `attr()`, customizable `<select>`, `shape()` |
| Modern additions | Newer tricks with their caveats attached | `@property`, container units, popovers, `scrollbar-gutter`, `content-visibility`, View Transitions, custom highlights |
| User preferences | Accessibility defaults the agent should apply | `prefers-reduced-motion`, `prefers-contrast`, `forced-colors`, `prefers-reduced-transparency` |
| Tailwind v4 | How the patterns map onto v4's CSS-first config | `@theme`, `@utility`, `@custom-variant`, native layers |
| Modernization guide | What replaced the old advice | padding-ratio boxes, `max-height` disclosure, global owl selectors, strict `local()` fonts |

## Install

```bash
npm install css-pro-tips
```

Then copy `SKILL.md` into your agent's skill directory. For Claude Code:

```bash
mkdir -p ~/.claude/skills/css-protips
cp node_modules/css-pro-tips/SKILL.md ~/.claude/skills/css-protips/
```

If you would rather not use npm, download [`SKILL.md`](./SKILL.md) and copy it to the same place.

To update later, run `npm update css-pro-tips` and copy the file again. On macOS or Linux you can symlink it once and skip the copying:

```bash
ln -sf "$(pwd)/node_modules/css-pro-tips/SKILL.md" ~/.claude/skills/css-protips/SKILL.md
```

## Where the file goes

| Agent | Destination |
|---|---|
| Claude Code | `~/.claude/skills/css-protips/SKILL.md`, or `.claude/skills/...` for one project |
| Codex CLI | `~/.codex/skills/css-protips/SKILL.md`, or `.agents/skills/...` to commit it to a repo |
| OpenCode | `.opencode/skills/css-protips/SKILL.md`, and it also reads `.claude/skills/` and `.agents/skills/` |
| Pi | `~/.pi/skills/css-protips/SKILL.md`, then call `/skill:css-protips` in a session |
| Kiro | `.kiro/steering/css-protips.md`, or `~/.kiro/steering/` for a global install |

Cursor is the odd one out, since it uses `.mdc` rules rather than `SKILL.md`:

```bash
mkdir -p .cursor/rules
cp node_modules/css-pro-tips/SKILL.md .cursor/rules/css-protips.mdc
```

Then add frontmatter at the top of that file:

```mdc
---
description: Modern, Baseline-aware CSS patterns and pro-tips
globs: ["**/*.css", "**/*.scss", "**/*.{tsx,jsx,vue,svelte,astro}"]
alwaysApply: false
---
```

## Verification

- Package version: [`1.2.0`](./package.json)
- Last validation window: August 2026
- Compatibility model: [MDN Baseline](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility)
- Change history: [`CHANGELOG.md`](./CHANGELOG.md)

Baseline tells you whether browsers support a feature. It says nothing about whether your CSS is accessible, keyboard-usable, readable at your contrast ratio, or fast on the devices your users own. Test for those separately.

## Contributing

Pull requests are welcome. If you add or change a compatibility claim:

1. Cite the Baseline status or the compatibility source.
2. Keep the `@supports` fallback for anything with limited or audience-dependent support.
3. Move superseded tricks into the modernization section rather than deleting them, since knowing why an old pattern existed is useful.
4. Keep examples small. An agent should be able to reuse a snippet without pasting an entire component.

## Maintainer

Built and maintained by Mohamed Elkholy ([elkaix](https://github.com/elkaix)) under the [PyModel](https://github.com/PyModel) organization.

## License

[MIT](./LICENSE) © 2026 Mohamed Elkholy.
