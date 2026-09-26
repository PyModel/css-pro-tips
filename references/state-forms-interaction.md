<!-- Generated from content/. Edit canonical files and run npm run build. -->

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

`<dialog closedby="any">` declares outside-click dismissal declaratively, and `popover="hint"` creates a tooltip-style popover that does not dismiss an open auto popover. Both are HTML attributes, not CSS capabilities: prefer them over a synthetic close-management class, and keep an owner-managed fallback where the product floor needs it. [MDN dialog closedby][ref-dialog-closedby] [MDN popover hint][ref-popover-hint]

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

## Capability guidance

### Focus Visible

- **Recommendation:** Preserve a high-contrast :focus-visible indicator with space from the control.
- **Use when:** Any keyboard-focusable element is styled.
- **Avoid when:** Removing outlines without an equivalent visible replacement.
- **Fallback:** :focus remains a viable conservative baseline.
- **Accessibility checks:** focus, forced-colors

### Relational State

- **Recommendation:** Use :has() for local relational state and native pseudo-classes before JavaScript class toggles.
- **Use when:** A component appearance depends on one of its descendants or native state.
- **Avoid when:** Broad document-root :has() selectors without measuring invalidation.
- **Fallback:** A real data/state class set by the owning behavior.
- **Performance:** Scope relational selectors to the smallest owning component.

### Form State

- **Recommendation:** Use native validation and :user-valid/:user-invalid after interaction; style ARIA state only when the semantics already exist.
- **Use when:** Forms and validation messages are semantic controls.
- **Avoid when:** CSS-only validation logic or ARIA attributes added solely for visual styling.
- **Fallback:** Native validity UI and explicit server/client messages.
- **Accessibility checks:** forms, focus

### Native Disclosures

- **Recommendation:** Prefer details, dialog, and the :open state where their semantics match the interaction.
- **Use when:** Content expands, a dialog opens, or a native control exposes state.
- **Avoid when:** Div-based widgets that recreate native keyboard and accessibility behavior.
- **Fallback:** A semantic always-visible content flow or established accessible control.
- **Accessibility checks:** keyboard, focus
- **Performance:** Native state avoids synchronization code.

### Popover

- **Recommendation:** Use the Popover API for transient top-layer UI when native popover behavior fits.
- **Use when:** A non-modal contextual surface needs light-dismiss and top-layer handling.
- **Avoid when:** Do not replace a dialog with a popover when modality is required.
- **Fallback:** Inline content or an established accessible dialog path.
- **Accessibility checks:** keyboard, focus
- **Performance:** Native top-layer state avoids manual stacking code.

### Customizable Select

- **Recommendation:** Treat customizable select as an enhancement; preserve a real select and its keyboard behavior.
- **Use when:** The browser floor supports the required appearance/picker features.
- **Avoid when:** Replacing native select semantics just to match a visual design.
- **Fallback:** Native select styling with accent-color as an optional enhancement.
- **Accessibility checks:** forms, keyboard

# Reference index

[ref-appearance]: https://developer.mozilla.org/en-US/docs/Web/CSS/appearance
[ref-backdrop]: https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop
[ref-content]: https://developer.mozilla.org/en-US/docs/Web/CSS/content
[ref-dialog-closedby]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby
[ref-empty]: https://developer.mozilla.org/en-US/docs/Web/CSS/:empty
[ref-focus-visible]: https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
[ref-has]: https://developer.mozilla.org/en-US/docs/Web/CSS/:has
[ref-is]: https://developer.mozilla.org/en-US/docs/Web/CSS/:is
[ref-not]: https://developer.mozilla.org/en-US/docs/Web/CSS/:not
[ref-nth-child]: https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child
[ref-open]: https://developer.mozilla.org/en-US/docs/Web/CSS/:open
[ref-picker]: https://developer.mozilla.org/en-US/docs/Web/CSS/::picker
[ref-pointer-events]: https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events
[ref-popover-hint]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover#hint
[ref-popover-open]: https://developer.mozilla.org/en-US/docs/Web/CSS/:popover-open
[ref-user-invalid]: https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid
[ref-user-valid]: https://developer.mozilla.org/en-US/docs/Web/CSS/:user-valid
[ref-where]: https://developer.mozilla.org/en-US/docs/Web/CSS/:where
