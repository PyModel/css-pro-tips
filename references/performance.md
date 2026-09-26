<!-- Generated from content/. Edit canonical files and run npm run build. -->

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

## Capability guidance

### Css Delivery

- **Recommendation:** Minify, compress, fingerprint/cache, and split CSS by actual route/use boundaries.
- **Use when:** Shipping production CSS.
- **Avoid when:** Combining or splitting files solely because of HTTP-era folklore.
- **Fallback:** A single cacheable stylesheet is acceptable for a small application.
- **Performance:** Measure bytes, waterfall, LCP, CLS, and unused CSS.

### Critical Css

- **Recommendation:** Inline only genuinely critical, stable above-the-fold CSS after measuring a delivery problem.
- **Use when:** Render blocking CSS materially delays LCP and a bounded route-specific extraction exists.
- **Avoid when:** Large duplicated inline styles that reduce caching or complicate CSP.
- **Fallback:** Normal cacheable stylesheet delivery.
- **Performance:** Evaluate LCP and cache trade-offs per route.

### Content Visibility

- **Recommendation:** Use content-visibility: auto for large, offscreen, self-contained sections with an intrinsic-size estimate.
- **Use when:** Long feeds, documentation, or dashboards have expensive offscreen subtrees.
- **Avoid when:** Content needed for find-in-page, anchor navigation, or immediate measurement without testing behavior.
- **Fallback:** Normal rendering.
- **Accessibility checks:** find-in-page
- **Performance:** Can reduce offscreen layout/paint work; validate actual interaction behavior.

# Reference index

[ref-contain-intrinsic-size]: https://developer.mozilla.org/en-US/docs/Web/CSS/contain-intrinsic-size
[ref-content-visibility]: https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility
[ref-webdev-css-performance]: https://web.dev/articles/optimize-css
