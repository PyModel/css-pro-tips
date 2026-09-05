# Changelog

All notable changes to this project are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/); versions follow [SemVer](https://semver.org/).

## [Unreleased]

### Added
- Five-part execution contract with scoped inputs, review-only defaults, verification gates, explicit result states, and non-destructive recovery.
- Optional, version-pinned Animate.css reference covering integration, accessibility, cancellation, bundle delivery, license differences, migration, and rollback. No Animate.css dependency or vendored library source.
- Eleven content regression tests and read-only CI for validation, reproducible generation, and the six-file package contract.

### Fixed
- Invalid nested vendor `@import` example and incomplete cascade-layer precedence explanation.
- Global near-zero reduced-motion reset that left delays and override conflicts unaddressed.
- Disclosure guidance that treated visual collapse as sufficient semantic state.
- Snippet targets incorrectly subjected to workspace path checks, and review-only payload/finalization instructions that still required edits.
- Normal-motion feedback defaults overriding Animate.css delay/repeat/infinite helpers and inherited timing variables.

### Evidence
- New motion references reviewed September 4, 2026. The broader compatibility snapshot remains August 2026; no release version or npm publication is implied.

## [1.3.0] - 2026-08-26

### Added

- A policy-driven multi-file source model for tokens, cascade control, static CSS,
  intrinsic layout, accessibility, performance, and progressive enhancement.
- Generated compatibility and evidence projections from canonical claims and sources.
- A deterministic builder plus source-contract freshness validation.

### Changed

- `SKILL.md` now leads with operating policy and groups guidance by engineering decision.
- README now documents the installed one-file interface and the maintainer-side source model.
- Package identity now names elkaix as maintainer under the PyModel organization.
- Statuses remain validated against current sources in August 2026.

## [1.2.0] — 2026-08-21

### Added

- Baseline 2026 features: container style queries, name-only container queries, `:open`,
  `text-box-trim` / `text-box`, and typed `attr()` behind `@supports`.
- Single-engine features in the limited bucket: customizable `<select>`, `shape()`,
  `corner-shape`, and media state pseudo-classes.
- `view-transition-class` and same-document view-transition types in the View Transitions
  pattern.
- A user-preference section covering `prefers-reduced-motion`, `prefers-contrast`,
  `forced-colors` with system color keywords, and `prefers-reduced-transparency`.
- A Tailwind v4 mapping section, which the frontmatter description had promised but the
  file never contained.
- A validation-window and status-review-dates table listing which statuses flip when.

### Fixed

- `@scope` is Baseline 2026 newly available (March 2026), not 2025.

### Changed

- Native CSS nesting is Baseline widely available since February 2026; the floor-check
  hedging is gone.
- Scroll-driven animations now note Safari 26 support with Firefox pending.
- `text-wrap` carries a per-value support caveat, `field-sizing` a Firefox partial-support
  note, and anchor positioning a note that newly available is not bug-free.
- Relative color syntax is stated separately from `oklch()` and guarded with `@supports`.
- Statuses reverified against MDN, browser-compat-data, and web.dev in August 2026.
- Repository moved to the PyModel organization; README rewritten with rounded badges.

### Removed

- Two unused reference-index entries.

## [1.1.1] — 2026-07-18

### Changed

- Revalidated `SKILL.md` compatibility statuses against MDN and
  `web-platform-dx/web-features` (July 2026 window). No pattern changes.

## [1.1.0] — 2026-07-05

### Changed

- Enhanced `SKILL.md` from the July 2026 validated-plus source, adding source-bound
  compatibility corrections and modern CSS additions.

## [1.0.1] — 2026-06-20

### Changed

- Standardized maintainer branding (README badge + author/maintainer line).
  No changes to `SKILL.md` content.

## [1.0.0] — 2026-06-20

### Added

- First public release as an npm-distributable, multi-agent CSS skill.
- `SKILL.md`: evergreen CSS tips plus a Modern CSS section bucketed by MDN Baseline
  (🟢 Widely / 🟡 Newly / 🔴 Limited), with `@supports` fallbacks for Limited features.
  Statuses verified against MDN + `web-platform-dx/web-features` (June 2026).
- README with verified install paths for Claude Code, Codex, Cursor, Pi, OpenCode, and Kiro.
- MIT license (© Mohamed Elkholy).
