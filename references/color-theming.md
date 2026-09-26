<!-- Generated from content/. Edit canonical files and run npm run build. -->

# 4. Color & theming

## Tokenize semantic roles, not swatches

Create a complete default semantic theme first. Components consume roles such as `--color-surface`, `--color-text`, and `--color-action`; primitive palette names remain implementation details.

```css
:root {
  color-scheme: light dark;
  --color-surface: oklch(98% 0.01 250);
  --color-text: oklch(22% 0.02 250);
  --color-action: oklch(56% 0.18 250);
  --color-action-text: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: oklch(20% 0.02 250);
    --color-text: oklch(94% 0.01 250);
  }
}

.button {
  color: var(--color-action-text);
  background: var(--color-action);
}
```

`oklch()` is a strong authored palette space because lightness is perceptually meaningful. Verify the final semantic token combinations for contrast; a perceptual color syntax is not an accessibility guarantee. [MDN oklch()][ref-oklch]

## Derive colors without scattering literals

Use `color-mix()` to derive a token from a semantic base. Precompute the baseline token first so the component does not require the feature.

```css
:root {
  --color-action-hover: oklch(48% 0.18 250);
}

@supports (color: color-mix(in oklch, black, white)) {
  :root {
    --color-action-hover: color-mix(in oklch, var(--color-action), black 12%);
  }
}
```

`color-mix()` is Widely available. Relative color syntax is newer, so keep a precomputed semantic fallback rather than implying that it shares `oklch()` support. [MDN color-mix()][ref-color-mix] [MDN relative colors][ref-relative-colors]

## Theme enhancements stay optional

`light-dark()` can simplify paired token declarations, but a `prefers-color-scheme` override is the viable baseline while it is Newly available. `contrast-color()` is likewise an enhancement over a verified authored foreground token. [MDN light-dark()][ref-light-dark] [MDN contrast-color()][ref-contrast-color]

```css
@supports (color: light-dark(white, black)) {
  :root { --color-surface: light-dark(white, #161616); }
}
```

Do not depend on `accent-color` for essential brand/control appearance: it remains Limited availability. In forced-colors mode, defer to the user agent or use system color keywords where an authored visual must remain meaningful. [MDN accent-color][ref-accent-color]

## Capability guidance

### Semantic Colors

- **Recommendation:** Map primitive palettes to semantic color tokens, then let components consume semantic roles.
- **Use when:** Supporting themes, brands, states, or user preferences.
- **Avoid when:** Component references to --blue-600 or repeated literal colors.
- **Fallback:** A complete default theme in custom properties.
- **Accessibility checks:** contrast, forced-colors
- **Performance:** Static custom properties make theme changes cheap.

### Modern Colors

- **Recommendation:** Prefer oklch() for authored perceptual palettes and color-mix() for derived semantic colors.
- **Use when:** Creating or deriving design-system colors.
- **Avoid when:** Relative color syntax without a fallback for the browser floor.
- **Fallback:** Precomputed semantic token values.
- **Accessibility checks:** contrast, forced-colors
- **Performance:** Precompute repeated complex color math in tokens.

# Reference index

[ref-accent-color]: https://developer.mozilla.org/en-US/docs/Web/CSS/accent-color
[ref-color-mix]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
[ref-contrast-color]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/contrast-color
[ref-light-dark]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
[ref-oklch]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
[ref-relative-colors]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors
