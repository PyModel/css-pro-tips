---
id: state-forms-interaction
type: concept
title: State, forms, and interaction
policy_ids: [semantic-accessibility, progressive-enhancement, measured-performance]
capability_ids:
  - focus-visible
  - relational-state
  - form-state
  - native-disclosures
  - popover
  - customizable-select
---

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
