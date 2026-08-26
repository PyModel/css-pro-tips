---
id: performance
type: concept
title: Performance
policy_ids: [static-css-first, measured-performance]
capability_ids:
  - css-delivery
  - critical-css
  - content-visibility
  - font-loading
---

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
