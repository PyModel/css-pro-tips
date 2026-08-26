---
id: tooling
type: concept
title: Tooling and workflow
policy_ids: [static-css-first, explicit-cascade, measured-performance]
capability_ids:
  - css-modules
  - tailwind-v4
  - sass
  - postcss-autoprefixer
  - stylelint
---

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

For this skill itself, run the generated-output/content-contract validator before publishing. The npm package ships only `SKILL.md`; the canonical multi-file source stays in the repository for maintainers.
