---
name: "css-protips"
description: "Use when writing, reviewing, refactoring, or modernizing CSS/Tailwind. Apply a policy-first approach: semantic tokens, explicit cascade order, static CSS, intrinsic component layouts, accessible state, measured performance, and progressive enhancement backed by current sources."
---

<!-- Generated from content/. Edit canonical files and run npm run build. -->

# CSS Protips — CSS engineering policy

Use this skill to make a design decision first, then select the smallest native implementation that fits. It is not a feature catalogue. Compatibility is evidence attached to a decision.

Statuses in this file were verified against current source records in **August 2026**.

## Decision order

1. Start with semantic design tokens.
2. Declare cascade ownership and layer order.
3. Prefer static/native CSS over runtime styling.
4. Let content and the component container choose layout before adding viewport breakpoints.
5. Ship a semantic, usable baseline before a newly available or Limited availability enhancement.
6. Preserve real HTML, focus, ARIA/data state, contrast, and user preferences.
7. Measure delivered output and browser behavior before optimizing.

## Compatibility is a constraint, not the navigation model

MDN Baseline is useful evidence for browser support, but it is not accessibility, performance, visual QA, or a promise about the product's actual browser floor. Treat **Widely available** as normal production CSS for current evergreen targets; verify **Newly available** features against the product floor; make **Limited availability** features optional. [MDN Baseline][ref-baseline]

For any non-broad feature, write the usable fallback first and isolate the enhancement:

```css
.card-list {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;
}

@supports (container-type: inline-size) {
  .card-list {
    container-type: inline-size;
  }
}
```

`@supports` proves syntax support only; still test the real interaction, content, and browser floor. [MDN @supports][ref-supports]

## Delivery checklist

Before considering a CSS change done, answer these in order:

1. Which semantic token, component boundary, and state own this value?
2. Does intrinsic layout solve it before a viewport query or JavaScript measurement?
3. Is static CSS plus attributes/custom properties enough?
4. What works when the enhancement does not?
5. Does keyboard focus, forced colors, reduced motion, zoom/reflow, and real content still work?

The generated compatibility summary and evidence index are maintainer projections. `SKILL.md` is the only file an installed agent needs.

# 1. Architecture

## Tokens are the CSS API

Keep primitive values separate from semantic intent. Components should consume `--color-action`, not `--blue-600`; a theme can change the semantic mapping without editing every component. CSS custom properties are the web interface to those tokens. [MDN custom properties][ref-custom-properties]

```css
:root {
  /* Primitive palette: implementation detail. */
  --blue-600: oklch(56% 0.18 250);
  --blue-700: oklch(48% 0.18 250);

  /* Semantic tokens: component contract. */
  --color-action: var(--blue-600);
  --color-action-hover: var(--blue-700);
  --space-4: 1rem;
  --radius-control: 0.5rem;
}

.button {
  border-radius: var(--radius-control);
  padding: var(--space-4);
  background: var(--color-action);
}
```

Use platform-neutral token source data when several clients consume the system; translate it to CSS custom properties for the web. Do not create a token merely to rename one local calculation.

## Declare the cascade once

Set layer order before rules. Later layers beat earlier layers regardless of selector specificity, so layer order is an ownership decision rather than an accident of import order. [MDN @layer][ref-layer]

```css
@layer reset, tokens, base, vendor, components, utilities, overrides;

@layer reset {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

@layer vendor {
  @import url("vendor.css") layer(vendor);
}

@layer components {
  .button { padding: var(--space-4); }
}
```

Keep user escape hatches intentional: `:where()` makes a default zero-specificity and easy to override; native nesting is normal production CSS, not a reason to create deeply coupled selector trees. [MDN :where()][ref-where] [MDN CSS nesting][ref-nesting]

If vendor CSS must be imported rather than bundled, place it explicitly in the vendor layer. [MDN @import][ref-import]

## Scope component ownership

Use the smallest ownership boundary that fits the codebase:

| Approach | Best default | Cost / boundary |
|---|---|---|
| CSS Modules | Component-owned traditional CSS | Generated local names; semantic DOM/state still matters |
| Tailwind v4 | Apps whose team prefers utility composition | Keep shared tokens and variants disciplined |
| BEM-like names | Static/global CSS where Modules are unavailable | Requires naming governance |
| Runtime CSS-in-JS | Demonstrated runtime-only styling need | Runtime work, ordering, and extraction complexity |

CSS Modules are a strong component default because the scope is explicit in the import boundary. Tailwind v4 is a strong app default only where utility composition is already the team convention. BEM, SMACSS, OOCSS, and ITCSS remain useful ideas about ownership and layering, not mandatory universal syntax. [CSS Modules][ref-css-modules] [Tailwind theme variables][ref-tailwind-theme]

Use native `@scope` as an enhancement when the browser floor permits it; CSS Modules or a component root class stay the baseline. [MDN @scope][ref-scope]

## State and naming contracts

Name components by role, not appearance. Expose real state with semantic HTML plus `aria-*` or `data-*` attributes, then let CSS reflect it. CSS must never create accessibility state.

```css
.disclosure[aria-expanded="true"] > .disclosure__icon {
  rotate: 180deg;
}

:where(.prose) > * + * {
  margin-block-start: var(--space-4);
}
```

Scope broad patterns such as the flow/"owl" selector to authored content. Prefer an SVG for multicolor art; use a CSS mask painted with `currentColor` for a monochrome icon that must follow text color. [MDN mask][ref-mask]

## Static CSS before runtime styling

Use classes, custom properties, native selectors, and attributes for known variants. A runtime CSS-in-JS layer needs a concrete value that cannot be represented by those inputs. `all: unset` is a component-reset tool, not a shortcut: restore layout, interaction, and focus explicitly; use `revert` when the intent is to return toward user-agent/user styles. [MDN all][ref-all] [MDN box-sizing][ref-box-sizing]

# 2. Layout & containers

## Choose Grid, Flexbox, or normal flow deliberately

- Use normal flow for document content.
- Use Flexbox for one-dimensional alignment and compact control groups.
- Use Grid when rows and columns must align together or repeated items need responsive tracks.

Do not recreate grid gutters with margins or force a grid into a one-dimensional job. [MDN Grid][ref-grid] [MDN Flex alignment][ref-flex-align]

```css
.card-list {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}
```

`auto-fit` and `minmax()` let the component wrap without a breakpoint. Use subgrid only when sharing tracks with a parent is the actual requirement. [MDN repeat()][ref-repeat] [MDN minmax()][ref-minmax] [MDN subgrid][ref-subgrid]

## Build intrinsically before querying

Prefer `aspect-ratio`, logical dimensions, flexible tracks, `gap`, and content-driven sizes. Avoid fixed heights that clip translations or zoomed content.

```css
.media {
  aspect-ratio: 16 / 9;
  overflow: clip;
}

.media > img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.sidebar-layout {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: minmax(0, 18rem) minmax(0, 1fr);
}
```

Use logical properties so writing direction is part of the default rather than an afterthought. Use `table-layout: fixed` only when the table width and clipping behavior are intentional. [MDN aspect-ratio][ref-aspect-ratio] [MDN object-fit][ref-object-fit] [MDN logical properties][ref-logical] [MDN table-layout][ref-table-layout]

Use `:dir()` only for a genuine direction-specific exception; logical properties should cover ordinary layout. [MDN :dir()][ref-dir]

## Component-first responsive layout

Use a container query when a component changes because of its parent width—not because the overall viewport crossed a number.

```css
.profile-card {
  container-type: inline-size;
}

.profile-card__content {
  display: grid;
  gap: var(--space-4);
}

@container (inline-size > 42rem) {
  .profile-card__content {
    grid-template-columns: 10rem minmax(0, 1fr);
  }
}
```

The unqueried grid is the fallback. Add a viewport query only for genuinely page-level behavior such as navigation composition. [MDN container queries][ref-container-queries]

Use container units for a component-local fluid value and use style queries only for explicit composition signals:

```css
.hero-title {
  font-size: clamp(2rem, 8cqi, 4.5rem);
}

@container style(--density: compact) {
  .profile-card { gap: var(--space-2); }
}
```

Keep a rem/clamp baseline for container units and a class/data-attribute baseline for style or name-only container queries. [MDN container query units][ref-container-query-units] [MDN @container][ref-container-at]

## Viewport and scrolling details

Use dynamic viewport units for viewport-owned shells only, and verify mobile toolbar behavior. Let document flow absorb content changes instead of pinning every section to a viewport height. [MDN viewport units][ref-viewport-units]

Use `scrollbar-gutter`, `scroll-margin-top`, and `overscroll-behavior` for the specific scroll issue they solve. They are not global resets. [MDN scrollbar-gutter][ref-scrollbar-gutter] [MDN scroll-margin-top][ref-scroll-margin-top] [MDN overscroll-behavior][ref-overscroll-behavior]

`field-sizing: content` and anchor positioning are Newly available enhancements: preserve a readable explicit-size/normal-position fallback and test real engines before making either load-bearing. [MDN field-sizing][ref-field-sizing] [MDN anchor positioning][ref-anchor-module]

# 3. Typography & fonts

## Make text readable before making it fluid

Use a unitless line height on text containers so descendants inherit a proportion, then bound fluid values with rem-based `clamp()`. The minimum must already be readable at zoom. [MDN line-height][ref-line-height] [MDN clamp()][ref-clamp]

```css
:root {
  --font-body: ui-sans-serif, system-ui, sans-serif;
  --step-0: clamp(1rem, 0.96rem + 0.2vw, 1.125rem);
  --step-4: clamp(2rem, 1.35rem + 3vw, 4.5rem);
}

body {
  font-family: var(--font-body);
  font-size: var(--step-0);
  line-height: 1.5;
}

h1 {
  font-size: var(--step-4);
  line-height: 1.05;
}
```

Use `calc()`, `min()`, and `max()` for bounded relationships. Do not use unbounded viewport math, a fixed height, or clipped overflow to make type fit a design mockup.

## Enhance wrapping and optical alignment

`text-wrap: balance` can improve short headings, but normal wrapping must remain good because values do not all have identical support. Apply it to small, targeted text blocks rather than every paragraph. [MDN text-wrap][ref-text-wrap]

```css
.page-title {
  max-inline-size: 18ch;
}

@supports (text-wrap: balance) {
  .page-title { text-wrap: balance; }
}
```

`text-box` trims leading for optical alignment. It is a Newly available enhancement: a normal line box is the fallback. [MDN text-box][ref-text-box]

```css
@supports (text-box: trim-both cap alphabetic) {
  .eyebrow { text-box: trim-both cap alphabetic; }
}
```

Use line clamping only where the full content remains available through a clear disclosure or a layout that does not hide required information.

## Fonts are a delivery decision

Self-host/subset the faces you need, choose `font-display` intentionally, and preload only a critical face proven to affect above-the-fold rendering. A broad preload list harms contention more often than it helps. [MDN @font-face src][ref-font-src] [MDN font-display][ref-font-display] [web.dev font best practices][ref-webdev-fonts]

```css
@font-face {
  font-family: "Brand Sans";
  src: url("/fonts/brand-sans-latin.woff2") format("woff2");
  font-display: swap;
  size-adjust: 98%;
}

:root {
  --font-brand: "Brand Sans", Arial, sans-serif;
}
```

Avoid strict `local()` sources for a branded face unless the version mismatch risk is acceptable. A user may have a different local font with the same name. Use `size-adjust` before more fragile metric overrides; gate Limited availability metric overrides and measure CLS with real content. [MDN size-adjust][ref-size-adjust] [MDN ascent-override][ref-ascent-override]

# 4. Color & theming

## Tokenize semantic roles, not swatches

Create a complete default semantic theme first. Components consume roles such as `--color-surface`, `--color-text`, and `--color-action`; primitive palette names remain implementation details.

```css
:root {
  color-scheme: light dark;
  --color-surface: oklch(98% 0.01 250);
  --color-text: oklch(22% 0.02 250);
  --color-action: oklch(56% 0.18 250);
  --color-action-text: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: oklch(20% 0.02 250);
    --color-text: oklch(94% 0.01 250);
  }
}

.button {
  color: var(--color-action-text);
  background: var(--color-action);
}
```

`oklch()` is a strong authored palette space because lightness is perceptually meaningful. Verify the final semantic token combinations for contrast; a perceptual color syntax is not an accessibility guarantee. [MDN oklch()][ref-oklch]

## Derive colors without scattering literals

Use `color-mix()` to derive a token from a semantic base. Precompute the baseline token first so the component does not require the feature.

```css
:root {
  --color-action-hover: oklch(48% 0.18 250);
}

@supports (color: color-mix(in oklch, black, white)) {
  :root {
    --color-action-hover: color-mix(in oklch, var(--color-action), black 12%);
  }
}
```

`color-mix()` is Widely available. Relative color syntax is newer, so keep a precomputed semantic fallback rather than implying that it shares `oklch()` support. [MDN color-mix()][ref-color-mix] [MDN relative colors][ref-relative-colors]

## Theme enhancements stay optional

`light-dark()` can simplify paired token declarations, but a `prefers-color-scheme` override is the viable baseline while it is Newly available. `contrast-color()` is likewise an enhancement over a verified authored foreground token. [MDN light-dark()][ref-light-dark] [MDN contrast-color()][ref-contrast-color]

```css
@supports (color: light-dark(white, black)) {
  :root { --color-surface: light-dark(white, #161616); }
}
```

Do not depend on `accent-color` for essential brand/control appearance: it remains Limited availability. In forced-colors mode, defer to the user agent or use system color keywords where an authored visual must remain meaningful. [MDN accent-color][ref-accent-color]

# 5. State, forms & interaction

## Focus is non-negotiable

Keep a visible keyboard-focus indicator. Never remove an outline unless an equally clear replacement exists in normal and forced-colors modes. [MDN :focus-visible][ref-focus-visible]

```css
:focus-visible {
  outline: 0.2rem solid currentColor;
  outline-offset: 0.2rem;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

## Reflect real state

Use semantic controls and native state first. CSS may reflect `aria-expanded`, `aria-invalid`, and `data-state`; it must never write or infer those accessibility states.

```css
.field:has(:user-invalid) {
  --field-border: var(--color-danger);
}

.field input:user-invalid {
  border-color: var(--field-border);
}

.disclosure[aria-expanded="true"] .disclosure__chevron {
  rotate: 180deg;
}
```

`:has()` is Widely available and reduces synchronization code for local component state. Scope it to the owning component; a broad document-root selector needs real invalidation evidence. `:user-valid` and `:user-invalid` avoid showing validation before a user has interacted. [MDN :has()][ref-has] [MDN :user-valid][ref-user-valid] [MDN :user-invalid][ref-user-invalid]

## Prefer native interaction primitives

Use `<details>` for a disclosure when it fits, `<dialog>` for modal semantics, and Popover API for transient non-modal top-layer UI. Style `:open` and `:popover-open` rather than manually duplicating open-state classes. Keep an inline/dialog fallback where the product floor needs it. [MDN :open][ref-open] [MDN :popover-open][ref-popover-open] [MDN ::backdrop][ref-backdrop]

```css
details:open > summary { font-weight: 700; }

[popover]:popover-open {
  opacity: 1;
  translate: 0;
}
```

Customizable `<select>` remains an enhancement. Keep a real select and its native keyboard behavior; do not recreate it with non-semantic divs just for visual control. [MDN appearance][ref-appearance] [MDN ::picker][ref-picker]

## Keep selectors intentional

Use `:where()` for override-friendly defaults, `:is()` for compact selector lists, `:not()` for exclusion, and `:nth-child(... of selector)` only where sibling filtering is truly the behavior. Scope `:empty`, generated `content`, and `pointer-events: none` narrowly: they can hide meaningful DOM states, copied text, or pointer behavior if treated as global tricks. [MDN :is()][ref-is] [MDN :where()][ref-where] [MDN :not()][ref-not] [MDN :nth-child()][ref-nth-child] [MDN :empty][ref-empty] [MDN content][ref-content] [MDN pointer-events][ref-pointer-events]

# 6. Motion & transitions

## Motion is feedback, not required content

Transition an intentional property for an intentional state. Do not use `transition: all`; it hides work, animates surprises, and makes reduced-motion policy harder to honor.

```css
.button {
  transition: background-color 160ms ease, color 160ms ease;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto;
    transition-duration: 0.01ms;
    animation-duration: 0.01ms;
    animation-iteration-count: 1;
  }
}
```

Make the reduced-motion result functionally complete, not merely shorter. [MDN prefers-reduced-motion][ref-reduced-motion]

## Disclosure: baseline first, intrinsic animation second

For unknown-height content, a grid-row transition has a usable baseline. It avoids guessing a `max-height` and keeps the open state semantic.

```css
.disclosure__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 180ms ease;
}

.disclosure__panel > * { min-block-size: 0; overflow: hidden; }

.disclosure[aria-expanded="true"] .disclosure__panel {
  grid-template-rows: 1fr;
}
```

`interpolate-size` and `calc-size()` are Limited availability. Use them only as an enhancement, and let the ordinary open/closed state remain useful without interpolation. [MDN interpolate-size][ref-interpolate-size] [MDN calc-size()][ref-calc-size]

## Top-layer entrances and discrete state

`@starting-style` and `transition-behavior: allow-discrete` can make a popover/dialog entrance smoother, but neither replaces semantic open state or a no-motion fallback. [MDN @starting-style][ref-starting-style] [MDN transition-behavior][ref-transition-behavior]

```css
[popover] {
  opacity: 0;
  transition: opacity 160ms ease, display 160ms allow-discrete;
}

[popover]:popover-open { opacity: 1; }

@starting-style {
  [popover]:popover-open { opacity: 0; }
}
```

Use `@property` when an animated custom property needs a declared type; it is not needed for ordinary properties or one-off static variables. [MDN @property][ref-property]

## Progressive visual enhancements

Scroll-driven animations remain Limited availability despite Safari support. Do not use them for progress, navigation, required reveal, or anything a reduced-motion user must perceive. [MDN scroll-driven animations][ref-scroll-driven] [WebKit scroll-driven animations][ref-webkit-sda]

Same-document View Transitions can enhance an already-complete state change. Name only elements that should participate, provide normal navigation/state behavior first, and honor reduced motion. Cross-document `@view-transition` remains a stricter browser-floor decision. [MDN view-transition-name][ref-view-transition-name] [MDN view-transition-class][ref-view-transition-class] [MDN @view-transition][ref-view-transition-at]

# 7. Accessibility & preferences

## Preserve semantics and visible focus

Use native controls before recreating their behavior. CSS can reflect a real `aria-*` or `data-*` value, but it cannot make a div behave as a button, create an accessible name, or announce validation. Keep focus visible and test it with a keyboard. [WCAG focus visible][ref-wcag-focus]

## Contrast is a token-level requirement

Check semantic foreground/background pairs, including hover, disabled, and dark-theme states. Do not assume a color function, a palette scale, or a browser-support label proves contrast. [WCAG contrast minimum][ref-wcag-contrast]

```css
:root {
  --focus-ring: Highlight;
}

@media (forced-colors: active) {
  :focus-visible {
    outline-color: Highlight;
  }

  .button {
    border: 1px solid ButtonText;
    color: ButtonText;
    background: ButtonFace;
  }
}
```

Use system color keywords only where the author needs a meaningful visual in forced-colors; otherwise allow the user agent to map colors. Avoid `forced-color-adjust: none` unless the result has been verified usable. [MDN forced-colors][ref-forced-colors] [MDN system colors][ref-system-colors] [MDN forced-color-adjust][ref-forced-color-adjust]

## Preferences are first-class inputs

Start with readable, low-motion defaults. Then respond to user preference without hiding essential information:

```css
@media (prefers-contrast: more) {
  :root { --border-subtle: currentColor; }
}

@media (prefers-reduced-transparency: reduce) {
  .glass { backdrop-filter: none; background: var(--color-surface); }
}
```

`prefers-contrast` is a normal preference input. `prefers-reduced-transparency` has a narrower floor, so the solid surface must be a valid default. [MDN prefers-contrast][ref-prefers-contrast] [MDN prefers-reduced-transparency][ref-reduced-transparency]

## Reflow and responsive type

Use `rem`, logical properties, flexible tracks, and bounded `clamp()` type. Test normal content at 400% zoom / a narrow CSS viewport; do not disable browser zoom, clip required content, or depend on hover-only state. [WCAG reflow][ref-wcag-reflow]

For media, autoplaying, unmuted, or decorative content, make the project policy explicit and keep a user-controlled, semantic alternative. Never hide essential video/audio solely with a broad CSS rule.

# 8. Performance

## Optimize evidence, not folklore

Measure shipped CSS bytes, unused CSS, the discovery waterfall, LCP, CLS, and style/layout work. Do not optimize selector appearance or stylesheet count because of old rules of thumb; HTTP/2/3 and the application's route/cache behavior change the answer. [web.dev optimize CSS][ref-webdev-css-performance]

Prioritize in this order:

1. Emit static, minified CSS and serve it compressed with content-hashed caching.
2. Remove unused styles and split by real route/use boundaries.
3. Subset fonts and preload only a face proven critical to LCP.
4. Inline only small, stable critical CSS after a measured render-blocking problem.
5. Profile costly selectors/animation in the browser before changing readable CSS.

## Keep dynamic styling static where possible

Custom properties, attributes, and classes normally eliminate a runtime style injection path. Build tools should preserve one ordered CSS output model; they should not emulate platform features forever.

Avoid broad relational selectors such as `body:has(...)` by default. A component-scoped relational selector is clearer and gives the browser a smaller boundary to track:

```css
/* Prefer the local owner. */
.checkout-summary:has(input:user-invalid) {
  border-color: var(--color-danger);
}
```

The concern is invalidation in the real DOM, not a universal ban on `:has()`. Profile a representative page before changing it.

## Use rendering containment surgically

`content-visibility: auto` can skip offscreen rendering work for a large, self-contained subtree. Pair it with `contain-intrinsic-size` to reduce scroll jumps, then test find-in-page, anchors, focus, and measurement behavior. [MDN content-visibility][ref-content-visibility] [MDN contain-intrinsic-size][ref-contain-intrinsic-size]

```css
.activity-feed {
  content-visibility: auto;
  contain-intrinsic-size: auto 48rem;
}
```

Do not turn it on globally. Font loading, animations, and critical CSS should each be measured against LCP/CLS and the actual waterfall, not assumed to be wins.

# 9. Tooling

## Tooling enforces policy; it does not replace the platform

Keep a checked-in browser target, then let tools implement that target consistently:

```text
Browserslist → PostCSS / Autoprefixer → static CSS output
Stylelint    → source policy and correctness in CI
Bundler      → minification, splitting, hashing, compression
```

Use PostCSS and Autoprefixer only when the checked-in Browserslist policy needs them. Revisit the target instead of carrying obsolete transforms indefinitely. [PostCSS][ref-postcss] [Autoprefixer][ref-autoprefixer] [Browserslist][ref-browserslist]

## CSS Modules, Tailwind v4, and preprocessors

CSS Modules are a component-local static CSS default. Tailwind v4 is also static output: use its token and utility APIs as a team convention, not as a substitute for component ownership.

```css
@import "tailwindcss";

@theme {
  --color-action: oklch(56% 0.18 250);
}

@utility focus-ring {
  &:focus-visible {
    outline: 0.2rem solid currentColor;
    outline-offset: 0.2rem;
  }
}
```

Tailwind v4's `@theme` and `@utility` should consume the same semantic token policy as component CSS. [Tailwind theme variables][ref-tailwind-theme] [Tailwind directives][ref-tailwind-directives]

Sass and Less are still reasonable for established codebases or genuine compile-time loops/functions. Do not add a preprocessor to a new project by reflex: native custom properties, nesting, `calc()`, `min()`, `max()`, and `clamp()` cover many former reasons. [Sass][ref-sass] [Less][ref-less]

## CI gates

Run Stylelint in CI for source correctness and the team's deliberate policies. Let the formatter own formatting; keep Stylelint focused on correctness, forbidden patterns, and architecture rules that review repeatedly misses. [Stylelint][ref-stylelint]

For this skill itself, run the generated-output/content-contract validator before publishing. The npm package ships only `SKILL.md`; the canonical multi-file source stays in the repository for maintainers.

# 10. Experimental / watchlist

Use this section to recognize a capability, not to make it load-bearing. A feature here needs a working baseline, a narrow `@supports`/browser-floor check, and a reason it improves this product.

| Capability | Use only when | Baseline fallback |
|---|---|---|
| Typed `attr()` | A typed attribute is a local convenience | Class, custom property, or owner logic |
| Customizable `<select>` | Native select semantics remain intact | Native select |
| `shape()` / `corner-shape` | Decorative geometry is optional | `polygon()`, `border-radius`, asset |
| Media state pseudo-classes | Media effect is optional | Owner-managed state |
| `::highlight()` | Custom range/search treatment is cosmetic | Browser selection/find treatment |
| Scroll-state queries | Scroll affordance is optional | No effect or owner state |
| `round()` | A value needs visual snapping | Ordinary `calc()` / precomputed value |
| `@function`, `if()`, sibling functions | Build/runtime baseline already works | Build-time or owner-calculated value |

These features carry distinct support stories; do not collapse them into a vague "modern CSS" label. [MDN attr()][ref-attr] [MDN shape()][ref-shape] [MDN corner-shape][ref-corner-shape] [MDN :playing][ref-playing] [MDN ::highlight()][ref-highlight] [MDN scroll-state queries][ref-scroll-state-queries] [MDN round()][ref-round] [MDN if()][ref-if] [MDN @function][ref-function] [MDN sibling-index()][ref-sibling-index] [MDN sibling-count()][ref-sibling-count]

## Native state that still needs a contract

`:defined`, custom-element `:state()`, and `@media (scripting)` can improve an existing component contract. Do not use them to hide required content while JavaScript initializes; the semantic/default DOM must remain useful. [MDN :defined][ref-defined] [MDN :state()][ref-state] [MDN scripting media feature][ref-scripting]

## Modernize by intent

| Retire | Prefer | Reason |
|---|---|---|
| Padding-ratio wrapper | `aspect-ratio` | Native intrinsic media sizing |
| `max-height` disclosure guess | Grid-row or no-motion disclosure | Unknown height remains correct |
| Margin gutters / `space-between` cards | Grid `auto-fit` + `gap` | Natural wrapping and consistent gaps |
| Global `* + *` | Scoped flow selector | Avoid third-party/component leakage |
| Strict branded `local()` source | Versioned webfont + fallback metrics | Avoid unknown installed font versions |
| JavaScript class for local parent state | Scoped `:has()` | Less state synchronization when support fits |

Keep the generated compatibility projection current. Promotion from Newly available to Widely available does not remove the need for accessibility, performance, and product-floor testing.

# Compatibility quick reference

This is a generated navigation projection. Choose the relevant decision module first; use this table to verify the browser-floor and fallback constraint.

## Widely available

| Capability | Fallback | Evidence |
|---|---|---|
| Aspect Ratio | Explicit dimensions only where content remains usable. | [MDN aspect-ratio][ref-aspect-ratio] [MDN Baseline compatibility][ref-baseline] |
| Cascade Layers | Intentional source order. | [MDN @layer][ref-layer] [MDN Baseline compatibility][ref-baseline] |
| Clamp | The min value. | [MDN clamp()][ref-clamp] [MDN Baseline compatibility][ref-baseline] |
| Color Mix | Precomputed derived color token. | [MDN color-mix()][ref-color-mix] [MDN Baseline compatibility][ref-baseline] |
| Container Queries | Intrinsic wrapping or a viewport query for page-level behavior. | [MDN container queries][ref-container-queries] [MDN Baseline compatibility][ref-baseline] |
| Container Units | rem and clamp values. | [MDN container query length units][ref-container-query-units] [MDN Baseline compatibility][ref-baseline] |
| Content Visibility | Normal rendering. | [MDN content-visibility][ref-content-visibility] [MDN contain-intrinsic-size][ref-contain-intrinsic-size] [MDN Baseline compatibility][ref-baseline] |
| Custom Properties | Literal default declarations are available, but semantic custom properties are the preferred interface. | [MDN CSS custom properties][ref-custom-properties] [MDN Baseline compatibility][ref-baseline] |
| Dynamic Viewport Units | min-block-size with normal document flow. | [MDN viewport length units][ref-viewport-units] [MDN Baseline compatibility][ref-baseline] |
| Flexbox | Block flow. | [MDN flex alignment][ref-flex-align] [MDN Baseline compatibility][ref-baseline] |
| Focus Visible | :focus indicator. | [MDN :focus-visible][ref-focus-visible] [MDN Baseline compatibility][ref-baseline] |
| Forced Colors | Permit user-agent color mapping. | [MDN forced-colors][ref-forced-colors] [MDN system colors][ref-system-colors] [MDN Baseline compatibility][ref-baseline] |
| Grid | Block flow or Flexbox. | [MDN CSS Grid Layout][ref-grid] [MDN Baseline compatibility][ref-baseline] |
| Has | Owner-managed class or data state. | [MDN :has()][ref-has] [MDN Baseline compatibility][ref-baseline] |
| Logical Properties | Physical properties for a constrained legacy direction policy. | [MDN logical properties][ref-logical] [MDN Baseline compatibility][ref-baseline] |
| Native Nesting | Flat selectors or a preprocessor in an existing project. | [MDN CSS nesting][ref-nesting] [MDN Baseline compatibility][ref-baseline] |
| Oklch | Precomputed sRGB semantic colors. | [MDN oklch()][ref-oklch] [MDN Baseline compatibility][ref-baseline] |
| Prefers Contrast | WCAG-conformant normal theme. | [MDN prefers-contrast][ref-prefers-contrast] [MDN Baseline compatibility][ref-baseline] |
| Property | Untyped custom property or ordinary property transition. | [MDN @property][ref-property] [MDN Baseline compatibility][ref-baseline] |
| Reduced Motion | Low-motion default. | [MDN prefers-reduced-motion][ref-reduced-motion] [MDN Baseline compatibility][ref-baseline] |
| Size Adjust | Normal fallback font metrics. | [MDN size-adjust][ref-size-adjust] [MDN Baseline compatibility][ref-baseline] |
| Subgrid | Explicit local tracks. | [MDN subgrid][ref-subgrid] [MDN Baseline compatibility][ref-baseline] |
| User Valid | Native validity UI and explicit messages. | [MDN :user-valid][ref-user-valid] [MDN :user-invalid][ref-user-invalid] [MDN Baseline compatibility][ref-baseline] |

## Newly available — verify floor

| Capability | Fallback | Evidence |
|---|---|---|
| Anchor Positioning | Conventional positioned layout or Popover API. | [MDN CSS anchor positioning][ref-anchor-module] [MDN Baseline compatibility][ref-baseline] |
| Container Style Queries | Explicit data or variant class. | [MDN @container][ref-container-at] [web.dev platform updates May 2026][ref-webdev-0526] |
| Contrast Color | A verified authored foreground token. | [MDN contrast-color()][ref-contrast-color] [MDN Baseline compatibility][ref-baseline] |
| Custom Highlights | Normal browser selection/find rendering. | [MDN ::highlight()][ref-highlight] [MDN Baseline compatibility][ref-baseline] |
| Field Sizing | Explicit logical sizes. | [MDN field-sizing][ref-field-sizing] [MDN Baseline compatibility][ref-baseline] |
| Light Dark | prefers-color-scheme token overrides. | [MDN light-dark()][ref-light-dark] [MDN Baseline compatibility][ref-baseline] |
| Name Only Container Queries | Explicit data or variant class. | [MDN @container][ref-container-at] [web.dev platform updates May 2026][ref-webdev-0526] |
| Open | Attribute selector or owner state class. | [MDN :open][ref-open] [web.dev platform updates May 2026][ref-webdev-0526] |
| Popover | Inline content or an accessible dialog. | [MDN :popover-open][ref-popover-open] [MDN Baseline compatibility][ref-baseline] |
| Same Document View Transitions | Normal state change. | [MDN view-transition-name][ref-view-transition-name] [MDN view-transition-class][ref-view-transition-class] [MDN Baseline compatibility][ref-baseline] |
| Scope | CSS Modules or a documented component root class. | [MDN @scope][ref-scope] [MDN Baseline compatibility][ref-baseline] |
| Starting Style | Enter without a transition. | [MDN @starting-style][ref-starting-style] [MDN Baseline compatibility][ref-baseline] |
| Text Box | Normal line box metrics. | [MDN text-box][ref-text-box] [MDN Baseline compatibility][ref-baseline] |
| Text Wrap | Normal wrapping. | [MDN text-wrap][ref-text-wrap] [MDN Baseline compatibility][ref-baseline] |
| Transition Behavior | Immediate discrete state change. | [MDN transition-behavior][ref-transition-behavior] [MDN Baseline compatibility][ref-baseline] |

## Limited availability — enhancement only

| Capability | Fallback | Evidence |
|---|---|---|
| Accent Color | Native control colors. | [MDN accent-color][ref-accent-color] [MDN Baseline compatibility][ref-baseline] |
| Ascent Override | size-adjust or an ordinary fallback stack. | [MDN ascent-override][ref-ascent-override] [MDN Baseline compatibility][ref-baseline] |
| Corner Shape | border-radius. | [MDN corner-shape][ref-corner-shape] [MDN Baseline compatibility][ref-baseline] |
| Customizable Select | Native select. | [MDN appearance][ref-appearance] [MDN ::picker][ref-picker] [MDN Baseline compatibility][ref-baseline] |
| Interpolate Size | Grid-row or immediate disclosure. | [MDN interpolate-size][ref-interpolate-size] [MDN calc-size()][ref-calc-size] [MDN Baseline compatibility][ref-baseline] |
| Line Clamp | Show full content or provide an explicit disclosure. | [MDN line-clamp][ref-line-clamp] [MDN Baseline compatibility][ref-baseline] |
| Media State Pseudo Classes | Owner-managed state class. | [MDN :playing][ref-playing] [MDN Baseline compatibility][ref-baseline] |
| Reduced Transparency | A solid-surface default. | [MDN prefers-reduced-transparency][ref-reduced-transparency] [MDN Baseline compatibility][ref-baseline] |
| Relative Colors | Precomputed semantic color token. | [MDN relative colors][ref-relative-colors] [MDN Baseline compatibility][ref-baseline] |
| Round | Ordinary calc or precomputed value. | [MDN round()][ref-round] [MDN Baseline compatibility][ref-baseline] |
| Scroll Driven Animations | Static content or ordinary transition. | [MDN scroll-driven animations][ref-scroll-driven] [MDN animation-timeline][ref-animation-timeline] [WebKit guide to scroll-driven animations][ref-webkit-sda] |
| Scroll State Queries | Owner-managed state class or no effect. | [MDN scroll-state container queries][ref-scroll-state-queries] [MDN Baseline compatibility][ref-baseline] |
| Shape | polygon(), border radius, or a static asset. | [MDN shape()][ref-shape] [MDN Baseline compatibility][ref-baseline] |
| Typed Attr | A class, custom property, or ordinary attribute interpreted by the owner. | [MDN attr()][ref-attr] [MDN Baseline compatibility][ref-baseline] |

## Experimental / watchlist

| Capability | Fallback | Evidence |
|---|---|---|
| Css Functions | Custom property values calculated by the build or owner code. | [MDN if()][ref-if] [MDN @function][ref-function] [MDN sibling-index()][ref-sibling-index] [MDN sibling-count()][ref-sibling-count] |

# Reference index

[ref-accent-color]: https://developer.mozilla.org/en-US/docs/Web/CSS/accent-color
[ref-all]: https://developer.mozilla.org/en-US/docs/Web/CSS/all
[ref-anchor-module]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning
[ref-animation-timeline]: https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline
[ref-appearance]: https://developer.mozilla.org/en-US/docs/Web/CSS/appearance
[ref-ascent-override]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/ascent-override
[ref-aspect-ratio]: https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio
[ref-attr]: https://developer.mozilla.org/en-US/docs/Web/CSS/attr
[ref-autoprefixer]: https://github.com/postcss/autoprefixer
[ref-backdrop]: https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop
[ref-baseline]: https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility
[ref-box-sizing]: https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing
[ref-browserslist]: https://browsersl.ist/
[ref-calc-size]: https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size
[ref-clamp]: https://developer.mozilla.org/en-US/docs/Web/CSS/clamp
[ref-color-mix]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
[ref-contain-intrinsic-size]: https://developer.mozilla.org/en-US/docs/Web/CSS/contain-intrinsic-size
[ref-container-at]: https://developer.mozilla.org/en-US/docs/Web/CSS/@container
[ref-container-queries]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
[ref-container-query-units]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries#container_query_length_units
[ref-content]: https://developer.mozilla.org/en-US/docs/Web/CSS/content
[ref-content-visibility]: https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility
[ref-contrast-color]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/contrast-color
[ref-corner-shape]: https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape
[ref-css-modules]: https://github.com/css-modules/css-modules
[ref-custom-properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties
[ref-defined]: https://developer.mozilla.org/en-US/docs/Web/CSS/:defined
[ref-dir]: https://developer.mozilla.org/en-US/docs/Web/CSS/:dir
[ref-empty]: https://developer.mozilla.org/en-US/docs/Web/CSS/:empty
[ref-field-sizing]: https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing
[ref-flex-align]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container
[ref-focus-visible]: https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
[ref-font-display]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
[ref-font-src]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src
[ref-forced-color-adjust]: https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust
[ref-forced-colors]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
[ref-function]: https://developer.mozilla.org/en-US/docs/Web/CSS/@function
[ref-grid]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
[ref-has]: https://developer.mozilla.org/en-US/docs/Web/CSS/:has
[ref-highlight]: https://developer.mozilla.org/en-US/docs/Web/CSS/::highlight
[ref-if]: https://developer.mozilla.org/en-US/docs/Web/CSS/if
[ref-import]: https://developer.mozilla.org/en-US/docs/Web/CSS/@import
[ref-interpolate-size]: https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size
[ref-is]: https://developer.mozilla.org/en-US/docs/Web/CSS/:is
[ref-layer]: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
[ref-less]: https://lesscss.org/
[ref-light-dark]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
[ref-line-clamp]: https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp
[ref-line-height]: https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
[ref-logical]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
[ref-mask]: https://developer.mozilla.org/en-US/docs/Web/CSS/mask
[ref-minmax]: https://developer.mozilla.org/en-US/docs/Web/CSS/minmax
[ref-nesting]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting
[ref-not]: https://developer.mozilla.org/en-US/docs/Web/CSS/:not
[ref-nth-child]: https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child
[ref-object-fit]: https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
[ref-oklch]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
[ref-open]: https://developer.mozilla.org/en-US/docs/Web/CSS/:open
[ref-overscroll-behavior]: https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior
[ref-picker]: https://developer.mozilla.org/en-US/docs/Web/CSS/::picker
[ref-playing]: https://developer.mozilla.org/en-US/docs/Web/CSS/:playing
[ref-pointer-events]: https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events
[ref-popover-open]: https://developer.mozilla.org/en-US/docs/Web/CSS/:popover-open
[ref-postcss]: https://postcss.org/
[ref-prefers-contrast]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast
[ref-property]: https://developer.mozilla.org/en-US/docs/Web/CSS/@property
[ref-reduced-motion]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
[ref-reduced-transparency]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency
[ref-relative-colors]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors
[ref-repeat]: https://developer.mozilla.org/en-US/docs/Web/CSS/repeat
[ref-round]: https://developer.mozilla.org/en-US/docs/Web/CSS/round
[ref-sass]: https://sass-lang.com/documentation/
[ref-scope]: https://developer.mozilla.org/en-US/docs/Web/CSS/@scope
[ref-scripting]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/scripting
[ref-scroll-driven]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations
[ref-scroll-margin-top]: https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top
[ref-scroll-state-queries]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_conditional_rules/Container_scroll-state_queries
[ref-scrollbar-gutter]: https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter
[ref-shape]: https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape/shape
[ref-sibling-count]: https://developer.mozilla.org/en-US/docs/Web/CSS/sibling-count
[ref-sibling-index]: https://developer.mozilla.org/en-US/docs/Web/CSS/sibling-index
[ref-size-adjust]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust
[ref-starting-style]: https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
[ref-state]: https://developer.mozilla.org/en-US/docs/Web/CSS/:state
[ref-stylelint]: https://stylelint.io/
[ref-subgrid]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid
[ref-supports]: https://developer.mozilla.org/en-US/docs/Web/CSS/@supports
[ref-system-colors]: https://developer.mozilla.org/en-US/docs/Web/CSS/system-color
[ref-table-layout]: https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout
[ref-tailwind-directives]: https://tailwindcss.com/docs/functions-and-directives
[ref-tailwind-theme]: https://tailwindcss.com/docs/theme
[ref-text-box]: https://developer.mozilla.org/en-US/docs/Web/CSS/text-box
[ref-text-wrap]: https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap
[ref-transition-behavior]: https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior
[ref-user-invalid]: https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid
[ref-user-valid]: https://developer.mozilla.org/en-US/docs/Web/CSS/:user-valid
[ref-view-transition-at]: https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition
[ref-view-transition-class]: https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-class
[ref-view-transition-name]: https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name
[ref-viewport-units]: https://developer.mozilla.org/en-US/docs/Web/CSS/length#relative_length_units_based_on_viewport
[ref-wcag-contrast]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
[ref-wcag-focus]: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
[ref-wcag-reflow]: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
[ref-webdev-0526]: https://web.dev/blog/web-platform-05-2026
[ref-webdev-css-performance]: https://web.dev/articles/optimize-css
[ref-webdev-fonts]: https://web.dev/articles/font-best-practices
[ref-webkit-sda]: https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css
[ref-where]: https://developer.mozilla.org/en-US/docs/Web/CSS/:where
