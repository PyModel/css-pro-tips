---
id: typography-fonts
type: concept
title: Typography and fonts
policy_ids: [tokens-first, intrinsic-layout-first, progressive-enhancement, measured-performance]
capability_ids:
  - fluid-type
  - font-loading
  - font-metrics
  - text-wrapping
  - text-box
---

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
