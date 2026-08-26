---
id: motion-transitions
type: concept
title: Motion and transitions
policy_ids: [progressive-enhancement, semantic-accessibility, measured-performance]
capability_ids:
  - ordinary-transitions
  - disclosure-motion
  - scroll-driven-animation
  - view-transitions
---

# 6. Motion & transitions

## Motion is feedback, not required content

Transition an intentional property for an intentional state. Do not use `transition: all`; it hides work, animates surprises, and makes reduced-motion policy harder to honor.

```css
.button {
  transition: background-color 160ms ease, color 160ms ease;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto;
    transition-duration: 0.01ms;
    animation-duration: 0.01ms;
    animation-iteration-count: 1;
  }
}
```

Make the reduced-motion result functionally complete, not merely shorter. [MDN prefers-reduced-motion][ref-reduced-motion]

## Disclosure: baseline first, intrinsic animation second

For unknown-height content, a grid-row transition has a usable baseline. It avoids guessing a `max-height` and keeps the open state semantic.

```css
.disclosure__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 180ms ease;
}

.disclosure__panel > * { min-block-size: 0; overflow: hidden; }

.disclosure[aria-expanded="true"] .disclosure__panel {
  grid-template-rows: 1fr;
}
```

`interpolate-size` and `calc-size()` are Limited availability. Use them only as an enhancement, and let the ordinary open/closed state remain useful without interpolation. [MDN interpolate-size][ref-interpolate-size] [MDN calc-size()][ref-calc-size]

## Top-layer entrances and discrete state

`@starting-style` and `transition-behavior: allow-discrete` can make a popover/dialog entrance smoother, but neither replaces semantic open state or a no-motion fallback. [MDN @starting-style][ref-starting-style] [MDN transition-behavior][ref-transition-behavior]

```css
[popover] {
  opacity: 0;
  transition: opacity 160ms ease, display 160ms allow-discrete;
}

[popover]:popover-open { opacity: 1; }

@starting-style {
  [popover]:popover-open { opacity: 0; }
}
```

Use `@property` when an animated custom property needs a declared type; it is not needed for ordinary properties or one-off static variables. [MDN @property][ref-property]

## Progressive visual enhancements

Scroll-driven animations remain Limited availability despite Safari support. Do not use them for progress, navigation, required reveal, or anything a reduced-motion user must perceive. [MDN scroll-driven animations][ref-scroll-driven] [WebKit scroll-driven animations][ref-webkit-sda]

Same-document View Transitions can enhance an already-complete state change. Name only elements that should participate, provide normal navigation/state behavior first, and honor reduced motion. Cross-document `@view-transition` remains a stricter browser-floor decision. [MDN view-transition-name][ref-view-transition-name] [MDN view-transition-class][ref-view-transition-class] [MDN @view-transition][ref-view-transition-at]
