# Compatibility quick reference

This is a generated navigation projection. Choose the relevant decision module first; use this table to verify the browser-floor and fallback constraint.

## Widely available

| Capability | Fallback | Evidence |
|---|---|---|
| Aspect Ratio | Explicit dimensions only where content remains usable. | [MDN aspect-ratio][ref-aspect-ratio] [MDN Baseline compatibility][ref-baseline] |
| Cascade Layers | Intentional source order. | [MDN @layer][ref-layer] [MDN Baseline compatibility][ref-baseline] |
| Clamp | The min value. | [MDN clamp()][ref-clamp] [MDN Baseline compatibility][ref-baseline] |
| Color Mix | Precomputed derived color token. | [MDN color-mix()][ref-color-mix] [MDN Baseline compatibility][ref-baseline] |
| Container Queries | Intrinsic wrapping or a viewport query for page-level behavior. | [MDN container queries][ref-container-queries] [MDN Baseline compatibility][ref-baseline] |
| Container Units | rem and clamp values. | [MDN container query length units][ref-container-query-units] [MDN Baseline compatibility][ref-baseline] |
| Content Visibility | Normal rendering. | [MDN content-visibility][ref-content-visibility] [MDN contain-intrinsic-size][ref-contain-intrinsic-size] [MDN Baseline compatibility][ref-baseline] |
| Custom Properties | Literal default declarations are available, but semantic custom properties are the preferred interface. | [MDN CSS custom properties][ref-custom-properties] [MDN Baseline compatibility][ref-baseline] |
| Dynamic Viewport Units | min-block-size with normal document flow. | [MDN viewport length units][ref-viewport-units] [MDN Baseline compatibility][ref-baseline] |
| Flexbox | Block flow. | [MDN flex alignment][ref-flex-align] [MDN Baseline compatibility][ref-baseline] |
| Focus Visible | :focus indicator. | [MDN :focus-visible][ref-focus-visible] [MDN Baseline compatibility][ref-baseline] |
| Forced Colors | Permit user-agent color mapping. | [MDN forced-colors][ref-forced-colors] [MDN system colors][ref-system-colors] [MDN Baseline compatibility][ref-baseline] |
| Grid | Block flow or Flexbox. | [MDN CSS Grid Layout][ref-grid] [MDN Baseline compatibility][ref-baseline] |
| Has | Owner-managed class or data state. | [MDN :has()][ref-has] [MDN Baseline compatibility][ref-baseline] |
| Logical Properties | Physical properties for a constrained legacy direction policy. | [MDN logical properties][ref-logical] [MDN Baseline compatibility][ref-baseline] |
| Native Nesting | Flat selectors or a preprocessor in an existing project. | [MDN CSS nesting][ref-nesting] [MDN Baseline compatibility][ref-baseline] |
| Oklch | Precomputed sRGB semantic colors. | [MDN oklch()][ref-oklch] [MDN Baseline compatibility][ref-baseline] |
| Prefers Contrast | WCAG-conformant normal theme. | [MDN prefers-contrast][ref-prefers-contrast] [MDN Baseline compatibility][ref-baseline] |
| Property | Untyped custom property or ordinary property transition. | [MDN @property][ref-property] [MDN Baseline compatibility][ref-baseline] |
| Reduced Motion | Low-motion default. | [MDN prefers-reduced-motion][ref-reduced-motion] [MDN Baseline compatibility][ref-baseline] |
| Size Adjust | Normal fallback font metrics. | [MDN size-adjust][ref-size-adjust] [MDN Baseline compatibility][ref-baseline] |
| Subgrid | Explicit local tracks. | [MDN subgrid][ref-subgrid] [MDN Baseline compatibility][ref-baseline] |
| User Valid | Native validity UI and explicit messages. | [MDN :user-valid][ref-user-valid] [MDN :user-invalid][ref-user-invalid] [MDN Baseline compatibility][ref-baseline] |

## Newly available — verify floor

| Capability | Fallback | Evidence |
|---|---|---|
| Anchor Positioning | Conventional positioned layout or Popover API. | [MDN CSS anchor positioning][ref-anchor-module] [MDN Baseline compatibility][ref-baseline] |
| Container Style Queries | Explicit data or variant class. | [MDN @container][ref-container-at] [web.dev platform updates May 2026][ref-webdev-0526] |
| Contrast Color | A verified authored foreground token. | [MDN contrast-color()][ref-contrast-color] [MDN Baseline compatibility][ref-baseline] |
| Custom Highlights | Normal browser selection/find rendering. | [MDN ::highlight()][ref-highlight] [MDN Baseline compatibility][ref-baseline] |
| Field Sizing | Explicit logical sizes. | [MDN field-sizing][ref-field-sizing] [MDN Baseline compatibility][ref-baseline] |
| Light Dark | prefers-color-scheme token overrides. | [MDN light-dark()][ref-light-dark] [MDN Baseline compatibility][ref-baseline] |
| Name Only Container Queries | Explicit data or variant class. | [MDN @container][ref-container-at] [web.dev platform updates May 2026][ref-webdev-0526] |
| Open | Attribute selector or owner state class. | [MDN :open][ref-open] [web.dev platform updates May 2026][ref-webdev-0526] |
| Popover | Inline content or an accessible dialog. | [MDN :popover-open][ref-popover-open] [MDN Baseline compatibility][ref-baseline] |
| Same Document View Transitions | Normal state change. | [MDN view-transition-name][ref-view-transition-name] [MDN view-transition-class][ref-view-transition-class] [MDN Baseline compatibility][ref-baseline] |
| Scope | CSS Modules or a documented component root class. | [MDN @scope][ref-scope] [MDN Baseline compatibility][ref-baseline] |
| Starting Style | Enter without a transition. | [MDN @starting-style][ref-starting-style] [MDN Baseline compatibility][ref-baseline] |
| Text Box | Normal line box metrics. | [MDN text-box][ref-text-box] [MDN Baseline compatibility][ref-baseline] |
| Text Wrap | Normal wrapping. | [MDN text-wrap][ref-text-wrap] [MDN Baseline compatibility][ref-baseline] |
| Transition Behavior | Immediate discrete state change. | [MDN transition-behavior][ref-transition-behavior] [MDN Baseline compatibility][ref-baseline] |

## Limited availability — enhancement only

| Capability | Fallback | Evidence |
|---|---|---|
| Accent Color | Native control colors. | [MDN accent-color][ref-accent-color] [MDN Baseline compatibility][ref-baseline] |
| Ascent Override | size-adjust or an ordinary fallback stack. | [MDN ascent-override][ref-ascent-override] [MDN Baseline compatibility][ref-baseline] |
| Corner Shape | border-radius. | [MDN corner-shape][ref-corner-shape] [MDN Baseline compatibility][ref-baseline] |
| Customizable Select | Native select. | [MDN appearance][ref-appearance] [MDN ::picker][ref-picker] [MDN Baseline compatibility][ref-baseline] |
| Interpolate Size | Grid-row or immediate disclosure. | [MDN interpolate-size][ref-interpolate-size] [MDN calc-size()][ref-calc-size] [MDN Baseline compatibility][ref-baseline] |
| Line Clamp | Show full content or provide an explicit disclosure. | [MDN line-clamp][ref-line-clamp] [MDN Baseline compatibility][ref-baseline] |
| Media State Pseudo Classes | Owner-managed state class. | [MDN :playing][ref-playing] [MDN Baseline compatibility][ref-baseline] |
| Reduced Transparency | A solid-surface default. | [MDN prefers-reduced-transparency][ref-reduced-transparency] [MDN Baseline compatibility][ref-baseline] |
| Relative Colors | Precomputed semantic color token. | [MDN relative colors][ref-relative-colors] [MDN Baseline compatibility][ref-baseline] |
| Round | Ordinary calc or precomputed value. | [MDN round()][ref-round] [MDN Baseline compatibility][ref-baseline] |
| Scroll Driven Animations | Static content or ordinary transition. | [MDN scroll-driven animations][ref-scroll-driven] [MDN animation-timeline][ref-animation-timeline] [WebKit guide to scroll-driven animations][ref-webkit-sda] |
| Scroll State Queries | Owner-managed state class or no effect. | [MDN scroll-state container queries][ref-scroll-state-queries] [MDN Baseline compatibility][ref-baseline] |
| Shape | polygon(), border radius, or a static asset. | [MDN shape()][ref-shape] [MDN Baseline compatibility][ref-baseline] |
| Typed Attr | A class, custom property, or ordinary attribute interpreted by the owner. | [MDN attr()][ref-attr] [MDN Baseline compatibility][ref-baseline] |

## Experimental / watchlist

| Capability | Fallback | Evidence |
|---|---|---|
| Css Functions | Custom property values calculated by the build or owner code. | [MDN if()][ref-if] [MDN @function][ref-function] [MDN sibling-index()][ref-sibling-index] [MDN sibling-count()][ref-sibling-count] |

# Reference index

[ref-accent-color]: https://developer.mozilla.org/en-US/docs/Web/CSS/accent-color
[ref-anchor-module]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning
[ref-animation-timeline]: https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline
[ref-appearance]: https://developer.mozilla.org/en-US/docs/Web/CSS/appearance
[ref-ascent-override]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/ascent-override
[ref-aspect-ratio]: https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio
[ref-attr]: https://developer.mozilla.org/en-US/docs/Web/CSS/attr
[ref-baseline]: https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility
[ref-calc-size]: https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size
[ref-clamp]: https://developer.mozilla.org/en-US/docs/Web/CSS/clamp
[ref-color-mix]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
[ref-contain-intrinsic-size]: https://developer.mozilla.org/en-US/docs/Web/CSS/contain-intrinsic-size
[ref-container-at]: https://developer.mozilla.org/en-US/docs/Web/CSS/@container
[ref-container-queries]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
[ref-container-query-units]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries#container_query_length_units
[ref-content-visibility]: https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility
[ref-contrast-color]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/contrast-color
[ref-corner-shape]: https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape
[ref-custom-properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties
[ref-field-sizing]: https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing
[ref-flex-align]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container
[ref-focus-visible]: https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
[ref-forced-colors]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
[ref-function]: https://developer.mozilla.org/en-US/docs/Web/CSS/@function
[ref-grid]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
[ref-has]: https://developer.mozilla.org/en-US/docs/Web/CSS/:has
[ref-highlight]: https://developer.mozilla.org/en-US/docs/Web/CSS/::highlight
[ref-if]: https://developer.mozilla.org/en-US/docs/Web/CSS/if
[ref-interpolate-size]: https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size
[ref-layer]: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
[ref-light-dark]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
[ref-line-clamp]: https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp
[ref-logical]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
[ref-nesting]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting
[ref-oklch]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
[ref-open]: https://developer.mozilla.org/en-US/docs/Web/CSS/:open
[ref-picker]: https://developer.mozilla.org/en-US/docs/Web/CSS/::picker
[ref-playing]: https://developer.mozilla.org/en-US/docs/Web/CSS/:playing
[ref-popover-open]: https://developer.mozilla.org/en-US/docs/Web/CSS/:popover-open
[ref-prefers-contrast]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast
[ref-property]: https://developer.mozilla.org/en-US/docs/Web/CSS/@property
[ref-reduced-motion]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
[ref-reduced-transparency]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency
[ref-relative-colors]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors
[ref-round]: https://developer.mozilla.org/en-US/docs/Web/CSS/round
[ref-scope]: https://developer.mozilla.org/en-US/docs/Web/CSS/@scope
[ref-scroll-driven]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations
[ref-scroll-state-queries]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_conditional_rules/Container_scroll-state_queries
[ref-shape]: https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape/shape
[ref-sibling-count]: https://developer.mozilla.org/en-US/docs/Web/CSS/sibling-count
[ref-sibling-index]: https://developer.mozilla.org/en-US/docs/Web/CSS/sibling-index
[ref-size-adjust]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust
[ref-starting-style]: https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
[ref-subgrid]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid
[ref-system-colors]: https://developer.mozilla.org/en-US/docs/Web/CSS/system-color
[ref-text-box]: https://developer.mozilla.org/en-US/docs/Web/CSS/text-box
[ref-text-wrap]: https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap
[ref-transition-behavior]: https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior
[ref-user-invalid]: https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid
[ref-user-valid]: https://developer.mozilla.org/en-US/docs/Web/CSS/:user-valid
[ref-view-transition-class]: https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-class
[ref-view-transition-name]: https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name
[ref-viewport-units]: https://developer.mozilla.org/en-US/docs/Web/CSS/length#relative_length_units_based_on_viewport
[ref-webdev-0526]: https://web.dev/blog/web-platform-05-2026
[ref-webkit-sda]: https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css