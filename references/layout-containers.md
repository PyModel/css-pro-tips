<!-- Generated from content/. Edit canonical files and run npm run build. -->

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

## Capability guidance

### Grid Layout

- **Recommendation:** Use Grid for two-dimensional composition and repeated responsive tracks.
- **Use when:** Rows and columns must align together.
- **Avoid when:** One-dimensional distribution is clearer with Flexbox.
- **Fallback:** A single-column flow is usually viable.
- **Accessibility checks:** zoom-reflow
- **Performance:** Prefer readable tracks over layout JavaScript.

### Flex Layout

- **Recommendation:** Use Flexbox for one-dimensional alignment, distribution, and compact control groups.
- **Use when:** The main problem is a row or column, not cross-row alignment.
- **Avoid when:** Do not simulate a grid with margin hacks.
- **Fallback:** Block flow remains the baseline.
- **Accessibility checks:** zoom-reflow

### Intrinsic Layout

- **Recommendation:** Start with minmax(), auto-fit, aspect-ratio, logical sizes, and content-driven tracks.
- **Use when:** Components must work in unknown hosts or translations.
- **Avoid when:** Fixed heights that clip content or bind a component to one viewport.
- **Fallback:** Single-column flow with normal document layout.
- **Accessibility checks:** zoom-reflow
- **Performance:** Removes layout scripts and brittle breakpoint branches.

### Container Queries

- **Recommendation:** Query the component container when a component changes because of available parent width.
- **Use when:** A reusable component has different widths in different page regions.
- **Avoid when:** Page-wide conditions that genuinely belong to the viewport.
- **Fallback:** Intrinsic one-column or wrapping layout before the query.
- **Accessibility checks:** zoom-reflow
- **Performance:** Establish intentional container boundaries; avoid using them as a universal replacement for layout design.

### Container Units

- **Recommendation:** Use cqi/cqb units for component-local fluid values after a named sizing context exists.
- **Use when:** Component typography or spacing should scale with its container.
- **Avoid when:** Do not use container units without a sensible non-container fallback.
- **Fallback:** rem- and clamp()-based values.
- **Accessibility checks:** zoom-reflow

### Style Queries

- **Recommendation:** Use style queries for a deliberate component variant signal, not incidental computed styles.
- **Use when:** A container custom property represents an explicit composition choice.
- **Avoid when:** Do not encode application logic in cascading implementation details.
- **Fallback:** A normal variant class or data attribute.
- **Performance:** Keep the decision local to the component boundary.

# Reference index

[ref-anchor-module]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning
[ref-aspect-ratio]: https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio
[ref-container-at]: https://developer.mozilla.org/en-US/docs/Web/CSS/@container
[ref-container-queries]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
[ref-container-query-units]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries#container_query_length_units
[ref-dir]: https://developer.mozilla.org/en-US/docs/Web/CSS/:dir
[ref-field-sizing]: https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing
[ref-flex-align]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container
[ref-grid]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
[ref-logical]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
[ref-minmax]: https://developer.mozilla.org/en-US/docs/Web/CSS/minmax
[ref-object-fit]: https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
[ref-overscroll-behavior]: https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior
[ref-repeat]: https://developer.mozilla.org/en-US/docs/Web/CSS/repeat
[ref-scroll-margin-top]: https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top
[ref-scrollbar-gutter]: https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter
[ref-subgrid]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid
[ref-table-layout]: https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout
[ref-viewport-units]: https://developer.mozilla.org/en-US/docs/Web/CSS/length#relative_length_units_based_on_viewport
