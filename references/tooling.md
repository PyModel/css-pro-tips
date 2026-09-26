<!-- Generated from content/. Edit canonical files and run npm run build. -->

# 9. Tooling

## Tooling enforces policy; it does not replace the platform

Keep a checked-in browser target, then let tools implement that target consistently:

```text
Browserslist → PostCSS / Autoprefixer → static CSS output
Stylelint    → source policy and correctness in CI
Bundler      → minification, splitting, hashing, compression
```

Use PostCSS and Autoprefixer only when the checked-in Browserslist policy needs them. Revisit the target instead of carrying obsolete transforms indefinitely. [PostCSS][ref-postcss] [Autoprefixer][ref-autoprefixer] [Browserslist][ref-browserslist]

## CSS Modules, Tailwind v4, and preprocessors

CSS Modules are a component-local static CSS default. Tailwind v4 is also static output: use its token and utility APIs as a team convention, not as a substitute for component ownership.

```css
@import "tailwindcss";

@theme {
  --color-action: oklch(56% 0.18 250);
}

@utility focus-ring {
  &:focus-visible {
    outline: 0.2rem solid currentColor;
    outline-offset: 0.2rem;
  }
}
```

Tailwind v4's `@theme` and `@utility` should consume the same semantic token policy as component CSS. [Tailwind theme variables][ref-tailwind-theme] [Tailwind directives][ref-tailwind-directives]

Sass and Less are still reasonable for established codebases or genuine compile-time loops/functions. Do not add a preprocessor to a new project by reflex: native custom properties, nesting, `calc()`, `min()`, `max()`, and `clamp()` cover many former reasons. [Sass][ref-sass] [Less][ref-less]

## CI gates

Run Stylelint in CI for source correctness and the team's deliberate policies. Let the formatter own formatting; keep Stylelint focused on correctness, forbidden patterns, and architecture rules that review repeatedly misses. [Stylelint][ref-stylelint]

For this skill itself, run the generated-output/content-contract validator before publishing. The npm package ships `SKILL.md` plus generated `references/`; the canonical `content/` source stays in the repository for maintainers.

## Capability guidance

### Tailwind V4

- **Recommendation:** Treat Tailwind v4 as a static CSS compiler around tokens, utilities, variants, and native CSS layers.
- **Use when:** Utility composition is the project convention.
- **Avoid when:** Using arbitrary utilities as an escape hatch for unowned values.
- **Fallback:** Component CSS can consume the same custom properties.
- **Accessibility checks:** focus, contrast, motion
- **Performance:** Keep generated output in the normal CSS optimization pipeline.

### Sass

- **Recommendation:** Keep Sass for mature codebases or genuine compile-time loops/functions; do not add it by reflex to new CSS.
- **Use when:** Existing code or compilation needs justify it.
- **Avoid when:** Reimplementing runtime theming or native nesting with Sass.
- **Fallback:** Native custom properties, nesting, calc(), min(), max(), and clamp().
- **Performance:** Compile output still needs normal delivery optimization.

### Postcss Autoprefixer

- **Recommendation:** Use PostCSS/Autoprefixer only with a checked-in Browserslist target that reflects actual support policy.
- **Use when:** The project needs compatibility transforms or CSS processing.
- **Avoid when:** Prefixing blindly without an audience/browser target.
- **Fallback:** Native CSS where the browser floor already supports it.
- **Performance:** Remove obsolete transforms as the target evolves.

### Stylelint

- **Recommendation:** Run Stylelint in CI for source correctness and the team's policy rules.
- **Use when:** Multiple contributors edit CSS or consistency regressions recur.
- **Avoid when:** Enforcing stylistic rules that the formatter already handles.
- **Fallback:** A focused review checklist for small projects.

# Reference index

[ref-autoprefixer]: https://github.com/postcss/autoprefixer
[ref-browserslist]: https://browsersl.ist/
[ref-less]: https://lesscss.org/
[ref-postcss]: https://postcss.org/
[ref-sass]: https://sass-lang.com/documentation/
[ref-stylelint]: https://stylelint.io/
[ref-tailwind-directives]: https://tailwindcss.com/docs/functions-and-directives
[ref-tailwind-theme]: https://tailwindcss.com/docs/theme
