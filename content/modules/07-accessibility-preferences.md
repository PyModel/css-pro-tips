---
id: accessibility-preferences
type: concept
title: Accessibility and preferences
policy_ids: [semantic-accessibility, progressive-enhancement]
capability_ids:
  - focus-visible
  - forced-colors
  - preference-media
---

# 7. Accessibility & preferences

## Preserve semantics and visible focus

Use native controls before recreating their behavior. CSS can reflect a real `aria-*` or `data-*` value, but it cannot make a div behave as a button, create an accessible name, or announce validation. Keep focus visible and test it with a keyboard. [WCAG focus visible][ref-wcag-focus]

## Contrast is a token-level requirement

Check semantic foreground/background pairs, including hover, disabled, and dark-theme states. Do not assume a color function, a palette scale, or a browser-support label proves contrast. [WCAG contrast minimum][ref-wcag-contrast]

```css
:root {
  --focus-ring: Highlight;
}

@media (forced-colors: active) {
  :focus-visible {
    outline-color: Highlight;
  }

  .button {
    border: 1px solid ButtonText;
    color: ButtonText;
    background: ButtonFace;
  }
}
```

Use system color keywords only where the author needs a meaningful visual in forced-colors; otherwise allow the user agent to map colors. Avoid `forced-color-adjust: none` unless the result has been verified usable. [MDN forced-colors][ref-forced-colors] [MDN system colors][ref-system-colors] [MDN forced-color-adjust][ref-forced-color-adjust]

## Preferences are first-class inputs

Start with readable, low-motion defaults. Then respond to user preference without hiding essential information:

```css
@media (prefers-contrast: more) {
  :root { --border-subtle: currentColor; }
}

@media (prefers-reduced-transparency: reduce) {
  .glass { backdrop-filter: none; background: var(--color-surface); }
}
```

`prefers-contrast` is a normal preference input. `prefers-reduced-transparency` has a narrower floor, so the solid surface must be a valid default. [MDN prefers-contrast][ref-prefers-contrast] [MDN prefers-reduced-transparency][ref-reduced-transparency]

## Reflow and responsive type

Use `rem`, logical properties, flexible tracks, and bounded `clamp()` type. Test normal content at 400% zoom / a narrow CSS viewport; do not disable browser zoom, clip required content, or depend on hover-only state. [WCAG reflow][ref-wcag-reflow]

For media, autoplaying, unmuted, or decorative content, make the project policy explicit and keep a user-controlled, semantic alternative. Never hide essential video/audio solely with a broad CSS rule.
