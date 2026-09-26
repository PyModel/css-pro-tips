<!-- Generated from content/. Edit canonical files and run npm run build. -->

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

## Capability guidance

### Fluid Type

- **Recommendation:** Use rem-based clamp() for bounded fluid type and spacing.
- **Use when:** Type needs to scale between known readable limits.
- **Avoid when:** Unbounded viewport math or px-only type that ignores user zoom.
- **Fallback:** The minimum value is already a readable baseline.
- **Accessibility checks:** zoom-reflow

### Font Loading

- **Recommendation:** Subset fonts, use font-display intentionally, and preload only the critical face actually used above the fold.
- **Use when:** A custom font materially affects branded or high-traffic UI.
- **Avoid when:** Broad preload lists or strict local() use for brand fonts.
- **Fallback:** A metrically compatible system stack.
- **Accessibility checks:** readability
- **Performance:** Fonts affect LCP, CLS, and render blocking.

### Font Metrics

- **Recommendation:** Use size-adjust and metric overrides to reduce fallback-to-webfont layout shift.
- **Use when:** A fallback stack differs visibly from the delivered webfont.
- **Avoid when:** Do not tune metrics without measuring real text and fallback behavior.
- **Fallback:** A normal fallback font stack.
- **Accessibility checks:** readability
- **Performance:** Reduces CLS when a font swaps.

### Text Wrapping

- **Recommendation:** Use text-wrap: balance or pretty only as a progressive typography enhancement.
- **Use when:** Short headings or high-value text blocks benefit from better line breaks.
- **Avoid when:** Do not assume every text-wrap value has the same support.
- **Fallback:** Normal wrapping.
- **Accessibility checks:** readability
- **Performance:** Apply to small, targeted text blocks.

### Text Box

- **Recommendation:** Use text-box trimming for optical alignment only after the untrimmed layout works.
- **Use when:** Cap-height alignment materially improves a controlled component.
- **Avoid when:** Do not make content visibility depend on trimming.
- **Fallback:** Normal line box metrics.
- **Accessibility checks:** readability

# Reference index

[ref-ascent-override]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/ascent-override
[ref-clamp]: https://developer.mozilla.org/en-US/docs/Web/CSS/clamp
[ref-font-display]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
[ref-font-src]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src
[ref-line-height]: https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
[ref-size-adjust]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust
[ref-text-box]: https://developer.mozilla.org/en-US/docs/Web/CSS/text-box
[ref-text-wrap]: https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap
[ref-webdev-fonts]: https://web.dev/articles/font-best-practices
