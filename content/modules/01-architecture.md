---
id: architecture
type: concept
title: Architecture
policy_ids: [tokens-first, explicit-cascade, static-css-first]
capability_ids:
  - design-tokens
  - cascade-layers
  - component-scope
  - css-modules
  - utility-css
  - static-css
---

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
