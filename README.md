# If your coding assistant struggles with CSS, this is exactly why we created this skill.

CSS Pro-Tips gives your agent the CSS superpowers it needs: a clear policy for tokens, cascade control, static CSS, component-first layouts, accessibility, performance, and fallbacks that actually work.

<p align="center">
  <img src="./assets/banner.svg" alt="CSS Pro-Tips: policy-driven CSS guidance for AI coding agents" width="100%">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/css-pro-tips"><img alt="npm version" src="https://img.shields.io/npm/v/css-pro-tips?style=flat&color=14b8a6&labelColor=0f172a"></a>
  <a href="https://www.npmjs.com/package/css-pro-tips"><img alt="npm downloads" src="https://img.shields.io/npm/dt/css-pro-tips?style=flat-square"></a>
  <a href="https://github.com/PyModel/css-pro-tips"><img alt="visitors" src="https://komarev.com/ghpvc/?username=PyModel-css-pro-tips&label=visitors&color=4f46e5&style=flat-square"></a>
  <a href="./LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-f59e0b?style=flat&labelColor=0f172a"></a>
</p>

<p align="center">
  <a href="#install">Install</a> |
  <a href="#what-your-agent-gets">What your agent gets</a> |
  <a href="#use-it">Use it</a> |
  <a href="#maintain-it">Maintain it</a>
</p>

## Install

```bash
npm install css-pro-tips
```

Or add the repository through skills.sh:

```bash
npx skills add PyModel/css-pro-tips
```

Both paths give you the same installed artifact: one `SKILL.md` file. Copy it into the skill directory used by your agent. For Claude Code:

```bash
mkdir -p ~/.claude/skills/css-protips
cp node_modules/css-pro-tips/SKILL.md ~/.claude/skills/css-protips/
```

To update, run `npm update css-pro-tips` and copy the file again. On macOS or Linux, a symlink keeps the local skill pointed at the installed package:

```bash
ln -sf "$(pwd)/node_modules/css-pro-tips/SKILL.md" ~/.claude/skills/css-protips/SKILL.md
```

## What your agent gets

The skill starts with the decisions that shape good CSS, then supplies implementation guidance and compatibility evidence.

| Decision | Guidance |
|---|---|
| Architecture | Semantic design tokens, CSS custom properties, cascade layers, component scope, CSS Modules, Tailwind v4, and when runtime CSS-in-JS has a real reason to exist |
| Layout | Grid, Flexbox, intrinsic sizing, `aspect-ratio`, container queries, container units, style queries, and viewport fallbacks |
| Typography | Unitless line height, bounded `clamp()` type, `text-wrap`, `text-box`, font loading, subsetting, and fallback metrics |
| Color | Semantic themes, `oklch()`, `color-mix()`, `light-dark()`, relative-color fallbacks, and forced-colors behavior |
| State | `:focus-visible`, `:has()`, native form state, `:open`, popovers, customizable select, and real ARIA/data state |
| Motion | Ordinary transitions, disclosures, `@starting-style`, `allow-discrete`, View Transitions, scroll-driven animation limits, and reduced-motion policy |
| Accessibility | Focus, contrast, forced colors, reduced transparency, zoom, reflow, keyboard behavior, and semantic HTML |
| Performance | Static output, CSS delivery, critical CSS, fonts, `content-visibility`, and profiling instead of selector folklore |
| Tooling | CSS Modules, Tailwind v4, Sass/Less relevance, PostCSS, Autoprefixer, Browserslist, and Stylelint |

It also includes a generated compatibility quick reference. Widely available features can be normal production CSS for evergreen targets. Newly available features need a browser-floor check. Limited availability features are optional enhancements with a viable baseline first.

## Use it

1. Install or copy `SKILL.md` into your agent's skill directory.
2. Ask the agent to write, review, refactor, or modernize CSS.
3. The skill directs it to choose a policy and fallback before it chooses a feature.

It works with Claude Code, Codex CLI, Cursor, OpenCode, Pi, Kiro, and other tools that can read a `SKILL.md` file.

| Agent | Destination |
|---|---|
| Claude Code | `~/.claude/skills/css-protips/SKILL.md`, or `.claude/skills/...` for one project |
| Codex CLI | `~/.codex/skills/css-protips/SKILL.md`, or `.agents/skills/...` to commit it to a repository |
| OpenCode | `.opencode/skills/css-protips/SKILL.md`, plus `.claude/skills/` and `.agents/skills/` |
| Pi | `~/.pi/skills/css-protips/SKILL.md` |
| Kiro | `.kiro/steering/css-protips.md`, or `~/.kiro/steering/` |

Cursor uses `.mdc` rules. Copy the file to `.cursor/rules/css-protips.mdc`, then add Cursor frontmatter for the CSS and component file types you want it to match.

## Compatibility and evidence

- Package version: [`1.3.0`](./package.json)
- Last validation window: August 2026
- Compatibility model: [MDN Baseline](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility)
- Generated [compatibility summary](./docs/compatibility-summary.md)
- Generated [evidence index](./docs/evidence-index.md)
- Release history: [`CHANGELOG.md`](./CHANGELOG.md)

Baseline reports browser support, not whether a rule is accessible, keyboard-usable, readable, or fast. The skill treats those checks as separate constraints.

## Maintain it

`SKILL.md` is generated from the canonical files in [`content/`](./content/). The repository keeps policy, capabilities, compatibility claims, sources, and concept modules separate so a source update does not turn into a manual edit across several tables.

```bash
npm run build
npm test
npm run pack:check
```

`npm run build` regenerates `SKILL.md` and the two maintainer projections. `npm test` rejects stale generated output, invalid frontmatter, broken references, source-contract drift, release metadata drift, and unexpected package contents. The published npm package still contains only the one-file agent interface plus normal package metadata.

CSS Pro-Tips is maintained by [elkaix](https://github.com/elkaix) under the [PyModel](https://github.com/PyModel) organization.

## License

[MIT](./LICENSE) © 2026 elkaix
