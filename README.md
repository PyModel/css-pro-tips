# If your coding assistant struggles with CSS, this is exactly why we created this skill.

CSS Pro-Tips gives your agent the CSS superpowers it needs: a clear policy for tokens, cascade control, static CSS, component-first layouts, accessibility, performance, and fallbacks that actually work.

<p align="center">
  <img src="./assets/banner.svg" alt="CSS Pro-Tips: policy-driven CSS guidance for AI coding agents" width="100%">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/css-pro-tips"><img alt="npm version" src="https://img.shields.io/npm/v/css-pro-tips?style=flat&color=14b8a6&labelColor=0f172a"></a>
  <a href="https://www.npmjs.com/package/css-pro-tips"><img alt="npm downloads" src="https://img.shields.io/npm/dt/css-pro-tips?style=flat-square"></a>
  <a href="https://github.com/PyModel/css-pro-tips"><img alt="visitors" src="https://komarev.com/ghpvc/?username=PyModel-css-pro-tips&label=visitors&color=4f46e5&style=flat-square"></a>
  <a href="https://seoagent.com/skill-grader/PyModel/css-pro-tips"><img alt="Skill Grader" src="https://seoagent.com/skill-grader/badge/PyModel/css-pro-tips.svg" height="20"></a>
  <a href="./LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-f59e0b?style=flat&labelColor=0f172a"></a>
</p>

<p align="center">
  <a href="#install">Install</a> |
  <a href="#what-your-agent-gets">What your agent gets</a> |
  <a href="#use-it">Use it</a> |
  <a href="#maintain-it">Maintain it</a>
</p>

## Install

The fastest path works for 75+ coding agents. [`skills`](https://github.com/vercel-labs/skills) detects the agents you have installed and copies the skill into each one:

```bash
npx skills add PyModel/css-pro-tips            # this project
npx skills add PyModel/css-pro-tips -g         # every project (global)
npx skills add PyModel/css-pro-tips -g -a claude-code -a codex   # specific agents
```

Or install from npm and copy it yourself:

```bash
npm install css-pro-tips
SKILL_DIR=~/.claude/skills/css-protips          # pick your agent's path below
mkdir -p "$SKILL_DIR"
cp -R node_modules/css-pro-tips/SKILL.md node_modules/css-pro-tips/references "$SKILL_DIR"/
```

Always copy **both** `SKILL.md` and `references/`. `SKILL.md` is a small router that is loaded on every activation; it links to `references/*.md`, which the agent reads only when a task needs them. To pick up updates automatically, symlink the package instead of copying it. Remove any copied directory first, or the link is created inside it:

```bash
rm -rf "$SKILL_DIR" && ln -s "$(pwd)/node_modules/css-pro-tips" "$SKILL_DIR"
```

### Where each agent looks

Install into a `css-protips/` folder under one of these directories. Project paths can be committed so your team shares the skill.

| Agent | `npx skills -a` | Project | Global |
|---|---|---|---|
| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |
| OpenAI Codex | `codex` | `.agents/skills/` | `~/.codex/skills/` |
| Cursor | `cursor` | `.agents/skills/` | `~/.cursor/skills/` |
| GitHub Copilot | `github-copilot` | `.agents/skills/` | `~/.copilot/skills/` |
| Gemini CLI | `gemini-cli` | `.agents/skills/` | `~/.gemini/skills/` |
| Google Antigravity | `antigravity` | `.agents/skills/` | `~/.gemini/antigravity/skills/` |
| OpenCode | `opencode` | `.agents/skills/` | `~/.config/opencode/skills/` |
| Pi | `pi` | `.pi/skills/` | `~/.pi/agent/skills/` |
| Pythinker Code | — | `.pythinker-code/skills/` or `.agents/skills/` | `~/.pythinker-code/skills/` or `~/.agents/skills/` |
| Kiro CLI | `kiro-cli` | `.kiro/skills/` | `~/.kiro/skills/` |
| Windsurf | `windsurf` | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` |
| Cline, Warp, Zed, Kimi Code CLI | `cline`, `warp`, `zed`, `kimi-code-cli` | `.agents/skills/` | `~/.agents/skills/` |
| Amp, Replit | `amp`, `replit` | `.agents/skills/` | `~/.config/agents/skills/` |
| Roo Code | `roo` | `.roo/skills/` | `~/.roo/skills/` |
| Kilo Code | `kilo` | `.agents/skills/` | `~/.kilo/skills/` |
| Continue | `continue` | `.continue/skills/` | `~/.continue/skills/` |
| Goose | `goose` | `.goose/skills/` | `~/.config/goose/skills/` |
| Factory Droid | `droid` | `.agents/skills/` | `~/.factory/skills/` |
| Qwen Code | `qwen-code` | `.qwen/skills/` | `~/.qwen/skills/` |
| Grok Build | `grok` | `.grok/skills/` | `~/.grok/skills/` |
| Devin for Terminal | `devin` | `.devin/skills/` | `~/.config/devin/skills/` |
| JetBrains Junie | `junie` | `.junie/skills/` | `~/.junie/skills/` |
| Augment | `augment` | `.augment/skills/` | `~/.augment/skills/` |
| OpenHands | `openhands` | `.openhands/skills/` | `~/.openhands/skills/` |
| Trae | `trae` | `.trae/skills/` | `~/.trae/skills/` |
| Crush | `crush` | `.crush/skills/` | `~/.config/crush/skills/` |
| AiderDesk | `aider-desk` | `.aider-desk/skills/` | `~/.aider-desk/skills/` |

Paths come from the [`skills` supported-agents table](https://github.com/vercel-labs/skills#supported-agents), which lists the rest of the 75+ agents. Pythinker Code's paths come from its skill loader. Kiro custom agents also need `"resources": ["skill://.kiro/skills/**/SKILL.md"]` in `.kiro/agents/<agent>.json`.

**Aider** has no skill discovery. Load the router as a read-only conventions file, and add the reference files a task needs:

```bash
aider --read node_modules/css-pro-tips/SKILL.md \
      --read node_modules/css-pro-tips/references/layout-containers.md
```

To load it every session, add `read: [node_modules/css-pro-tips/SKILL.md]` to `.aider.conf.yml`.

## What your agent gets

The skill starts with an execution contract: activation and negative triggers, validated inputs, gated execution, acceptance criteria, and failure recovery. Review mode and no dependency changes are the defaults. It then supplies CSS decisions, implementation guidance, and compatibility evidence.

| Decision | Guidance |
|---|---|
| Architecture | Semantic design tokens, CSS custom properties, cascade layers, component scope, CSS Modules, Tailwind v4, and when runtime CSS-in-JS has a real reason to exist |
| Layout | Grid, Flexbox, intrinsic sizing, `aspect-ratio`, container queries, container units, style queries, and viewport fallbacks |
| Typography | Unitless line height, bounded `clamp()` type, `text-wrap`, `text-box`, font loading, subsetting, and fallback metrics |
| Color | Semantic themes, `oklch()`, `color-mix()`, `light-dark()`, relative-color fallbacks, and forced-colors behavior |
| State | `:focus-visible`, `:has()`, native form state, `:open`, popovers, customizable select, and real ARIA/data state |
| Motion | Native transitions, semantic disclosures, optional Animate.css presets, cancellation-safe lifecycle guidance, no-motion/print baselines, View Transitions, and scroll-driven animation limits |
| Accessibility | Focus, contrast, forced colors, reduced transparency, zoom, reflow, keyboard behavior, and semantic HTML |
| Performance | Static output, CSS delivery, critical CSS, fonts, `content-visibility`, and profiling instead of selector folklore |
| Tooling | CSS Modules, Tailwind v4, Sass/Less relevance, PostCSS, Autoprefixer, Browserslist, and Stylelint |

It also includes a generated compatibility quick reference. Widely available features can be normal production CSS for evergreen targets. Newly available features need a browser-floor check. Limited availability features are optional enhancements with a viable baseline first.

## Use it

1. Install the skill with `npx skills add` or copy `SKILL.md` and `references/` into your agent's skill directory.
2. Ask the agent to write, review, refactor, or modernize CSS.
3. The skill directs it to choose a policy and fallback before it chooses a feature, and to load only the references the task needs.

It follows the [Agent Skills specification](https://agentskills.io/specification), so any client that reads a `SKILL.md` directory can use it.

## Animate.css reference

The animation module references [Animate.css](https://animate.style/) without adding it as a package dependency. It covers the v4 class prefix, timing variables, single-owner imports, reduced-motion/print handling, cancellation and missing-CSS paths, production bundle checks, and migration/rollback.

The reference was reviewed on September 4, 2026 against the `v4.1.1` source tag. That tag's license is MIT; the live website states a different license. Check the exact distributed artifact and the project's dependency policy before adopting it. This is a versioned reference, not a claim that `4.1.1` is the latest release.

## Compatibility and evidence

- Package version: [`2.0.0`](./package.json)
- Last validation window: September 2026 (derived from the most recent claim `reviewed_at` in `content/evidence.yml`)
- Compatibility model: [MDN Baseline](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility)
- Generated [compatibility summary](./references/compatibility.md)
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

`npm run build` regenerates the `SKILL.md` router, `references/`, and the evidence index. `npm test` rejects stale generated output, invalid frontmatter, broken references, source-contract drift, release metadata drift, and unexpected package contents. It also checks the five-part execution contract, optional Animate.css guidance, versioned evidence, reduced-motion safeguards, and top-level vendor imports. GitHub Actions runs these checks with read-only repository permissions. The published npm package contains the router, its generated references, and normal package metadata; a word/heading ceiling test keeps the always-loaded router small.

The [September 2026 review](./docs/review-2026-09-04.md) records confirmed findings, verification scope, and remaining limitations. Browser-compatibility claims for motion references were refreshed in that review; adding animation references does not revalidate every browser claim.

CSS Pro-Tips is maintained by [elkaix](https://github.com/elkaix) under the [PyModel](https://github.com/PyModel) organization.

## License

[MIT](./LICENSE) © 2026 elkaix
