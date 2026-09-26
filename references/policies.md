<!-- Generated from content/. Edit canonical files and run npm run build. -->

# Policy commitments

Generated from `content/policies.yml`. A policy is a standing engineering commitment: apply it before implementation and verify it after.

## Tokens First (strong-default)

- **Rule:** Start with semantic design tokens; components consume semantic tokens instead of literal palette values.
- **Applies when:** Any value conveys reusable design intent across more than one rule or component.
- **Exceptions:** One-off, truly local geometry may stay local when a token would obscure intent.
- **Verification:** Search changed component rules for repeated literals and confirm shared values have semantic names.

## Explicit Cascade (strong-default)

- **Rule:** Declare cascade layer order once and keep defaults deliberately easy to override.
- **Applies when:** A project has vendor CSS, components, utilities, themes, or multiple authors.
- **Exceptions:** A small isolated stylesheet may use normal source order, but must not rely on accidental import order.
- **Verification:** Confirm reset, tokens, base, components, utilities, and overrides have an intentional order.

## Static Css First (strong-default)

- **Rule:** Prefer native, statically emitted CSS. Require a concrete runtime-only requirement before choosing runtime CSS-in-JS.
- **Applies when:** Writing component styles, theming, layout, states, or responsive behavior.
- **Exceptions:** Runtime values that cannot be represented by custom properties, attributes, or classes may justify a runtime style boundary.
- **Verification:** Identify the runtime requirement and prove it cannot be modeled by HTML state plus static CSS.

## Intrinsic Layout First (strong-default)

- **Rule:** Let content and the component's container drive sizing before adding viewport breakpoints.
- **Applies when:** Building cards, forms, media, sidebars, or reusable components.
- **Exceptions:** Page-level navigation and full-viewport composition may legitimately use viewport conditions.
- **Verification:** Test at narrow, wide, zoomed, and embedded container sizes before adding a viewport query.

## Progressive Enhancement (required)

- **Rule:** Build a viable semantic baseline first; add newly available or limited CSS only as an enhancement.
- **Applies when:** Browser support is not broad for the project's audience or the feature changes usability/layout.
- **Exceptions:** None for load-bearing behavior. A documented product browser floor may allow a stronger baseline.
- **Verification:** Disable the enhancement or emulate an unsupported browser and confirm the task still works.

## Semantic Accessibility (required)

- **Rule:** Preserve semantic HTML and real accessibility state. CSS may reflect ARIA/data state but must not invent it.
- **Applies when:** Styling controls, validation, disclosure, dialogs, focus, color, or motion.
- **Exceptions:** None for keyboard reachability, focus visibility, and readable contrast.
- **Verification:** Keyboard-test the interaction, inspect forced-colors/reduced-motion, and test reflow at 400% zoom.

## Measured Performance (strong-default)

- **Rule:** Optimize delivered bytes and user-visible rendering evidence, not selector or file-count folklore.
- **Applies when:** Changing CSS delivery, fonts, large lists, relational selectors, or animation.
- **Exceptions:** A clear production profile may justify a targeted micro-optimization.
- **Verification:** Compare shipped CSS, waterfall, LCP, CLS, unused CSS, and browser performance traces before and after.
