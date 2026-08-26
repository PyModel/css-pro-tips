---
id: layout-containers
type: concept
title: Layout and containers
policy_ids: [intrinsic-layout-first, progressive-enhancement]
capability_ids:
  - grid-layout
  - flex-layout
  - intrinsic-layout
  - container-queries
  - container-units
  - style-queries
---

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
