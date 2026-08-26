---
id: operating-policy
type: policy
title: Operating policy
policy_ids:
  - tokens-first
  - explicit-cascade
  - static-css-first
  - intrinsic-layout-first
  - progressive-enhancement
  - semantic-accessibility
  - measured-performance
capability_ids: []
---

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
