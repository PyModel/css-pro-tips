<!-- Generated from content/. Edit canonical files and run npm run build. -->

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

Set layer order before rules. Within the same origin, normal declarations in later layers beat earlier layers before specificity is considered; normal unlayered declarations beat layered declarations. For `!important` declarations, layer order reverses and layered important rules outrank unlayered important rules. Do not use a later override layer to try to defeat an earlier important vendor rule. These precedence rules are part of the stable CSS definition recorded by the CSS Snapshot 2026 note. [MDN @layer][ref-layer] [W3C CSS Snapshot 2026][ref-css-snapshot-2026]

```css
@layer reset, tokens, base, vendor, components, utilities, overrides;
@import url("vendor.css") layer(vendor);

@layer reset {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

@layer components {
  .button { padding: var(--space-4); }
}
```

Keep user escape hatches intentional: `:where()` makes a default zero-specificity and easy to override; native nesting is normal production CSS, not a reason to create deeply coupled selector trees. [MDN :where()][ref-where] [MDN CSS nesting][ref-nesting]

If vendor CSS must be imported rather than bundled, use a top-level import into the vendor layer before rule blocks. A layer-order statement may precede it; nesting `@import` inside a layer block is invalid. [MDN @import][ref-import]

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

## Capability guidance

### Design Tokens

- **Recommendation:** Use platform-neutral tokens when multiple clients share a system, then expose semantic CSS custom properties on the web.
- **Use when:** A value carries color, spacing, typography, radius, motion, or elevation intent.
- **Avoid when:** A token would merely rename a one-off local calculation.
- **Fallback:** Use a semantic custom-property default; do not make a component depend directly on a primitive palette name.
- **Accessibility checks:** contrast, forced-colors
- **Performance:** Custom properties avoid duplicated literal values and support static themes.

### Cascade Layers

- **Recommendation:** Declare layer order before rules and place third-party CSS in a lower-priority layer.
- **Use when:** Multiple style sources can compete.
- **Avoid when:** Never use layers to paper over a broken ownership boundary.
- **Fallback:** Source order remains a viable baseline for older engines.

### Component Scope

- **Recommendation:** Scope component styles through CSS Modules or a documented class/state contract; use native @scope only after checking the browser floor.
- **Use when:** Components are reused or owned by different teams.
- **Avoid when:** Global selectors that can leak into CMS, embeds, or vendor widgets.
- **Fallback:** CSS Modules/classes provide the baseline for @scope.
- **Performance:** Narrow scope reduces unintended invalidation and overrides.

### Css Modules

- **Recommendation:** Use CSS Modules as the component-local default when authoring traditional CSS.
- **Use when:** Component files own their markup and styles.
- **Avoid when:** Do not treat generated class names as a design-token system.
- **Fallback:** Documented BEM-like local naming is acceptable where Modules are unavailable.
- **Performance:** Static extraction keeps styles cacheable.

### Utility Css

- **Recommendation:** Use Tailwind v4 when the team prefers utility composition and its token/layer model is the shared convention.
- **Use when:** Application UI is composed close to templates and team fluency is high.
- **Avoid when:** Do not mix competing utility conventions without an ownership boundary.
- **Fallback:** Semantic component classes can consume the same tokens.
- **Accessibility checks:** focus, contrast, motion
- **Performance:** Build only the utilities the product actually uses.

### Static Css

- **Recommendation:** Emit static CSS and express dynamic values through custom properties, attributes, or classes first.
- **Use when:** Styling depends on known variants or state.
- **Avoid when:** Runtime CSS-in-JS without a demonstrated runtime-only need.
- **Fallback:** Static class variants are the baseline.
- **Performance:** Avoids runtime injection and enables normal caching/minification.

# Reference index

[ref-all]: https://developer.mozilla.org/en-US/docs/Web/CSS/all
[ref-box-sizing]: https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing
[ref-css-modules]: https://github.com/css-modules/css-modules
[ref-css-snapshot-2026]: https://www.w3.org/TR/css-2026/
[ref-custom-properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties
[ref-import]: https://developer.mozilla.org/en-US/docs/Web/CSS/@import
[ref-layer]: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
[ref-mask]: https://developer.mozilla.org/en-US/docs/Web/CSS/mask
[ref-nesting]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting
[ref-scope]: https://developer.mozilla.org/en-US/docs/Web/CSS/@scope
[ref-tailwind-theme]: https://tailwindcss.com/docs/theme
[ref-where]: https://developer.mozilla.org/en-US/docs/Web/CSS/:where
