# CSS Pro-Tips evidence index

Generated from `content/evidence.yml`. Edit canonical content, then run `npm run build`.

## Compatibility claims

| Claim | Status | Reviewed | Next review | Fallback | Sources |
|---|---|---|---|---|---|
| accent-color | Limited availability — enhancement only | August 2026 | — | Native control colors. | [MDN accent-color][ref-accent-color] [MDN Baseline compatibility][ref-baseline] |
| anchor-positioning | Newly available — verify floor | August 2026 | July 2028 | Conventional positioned layout or Popover API. | [MDN CSS anchor positioning][ref-anchor-module] [MDN Baseline compatibility][ref-baseline] |
| ascent-override | Limited availability — enhancement only | August 2026 | — | size-adjust or an ordinary fallback stack. | [MDN ascent-override][ref-ascent-override] [MDN Baseline compatibility][ref-baseline] |
| aspect-ratio | Widely available | August 2026 | — | Explicit dimensions only where content remains usable. | [MDN aspect-ratio][ref-aspect-ratio] [MDN Baseline compatibility][ref-baseline] |
| cascade-layers | Widely available | August 2026 | — | Intentional source order. | [MDN @layer][ref-layer] [MDN Baseline compatibility][ref-baseline] |
| clamp | Widely available | August 2026 | — | The min value. | [MDN clamp()][ref-clamp] [MDN Baseline compatibility][ref-baseline] |
| color-mix | Widely available | August 2026 | — | Precomputed derived color token. | [MDN color-mix()][ref-color-mix] [MDN Baseline compatibility][ref-baseline] |
| container-queries | Widely available | August 2026 | — | Intrinsic wrapping or a viewport query for page-level behavior. | [MDN container queries][ref-container-queries] [MDN Baseline compatibility][ref-baseline] |
| container-style-queries | Newly available — verify floor | August 2026 | November 2028 | Explicit data or variant class. | [MDN @container][ref-container-at] [web.dev platform updates May 2026][ref-webdev-0526] |
| container-units | Widely available | August 2026 | — | rem and clamp values. | [MDN container query length units][ref-container-query-units] [MDN Baseline compatibility][ref-baseline] |
| content-visibility | Widely available | August 2026 | — | Normal rendering. | [MDN content-visibility][ref-content-visibility] [MDN contain-intrinsic-size][ref-contain-intrinsic-size] [MDN Baseline compatibility][ref-baseline] |
| contrast-color | Newly available — verify floor | August 2026 | — | A verified authored foreground token. | [MDN contrast-color()][ref-contrast-color] [MDN Baseline compatibility][ref-baseline] |
| corner-shape | Limited availability — enhancement only | August 2026 | — | border-radius. | [MDN corner-shape][ref-corner-shape] [MDN Baseline compatibility][ref-baseline] |
| css-functions | Experimental / watchlist | August 2026 | — | Custom property values calculated by the build or owner code. | [MDN if()][ref-if] [MDN @function][ref-function] [MDN sibling-index()][ref-sibling-index] [MDN sibling-count()][ref-sibling-count] |
| custom-highlights | Newly available — verify floor | August 2026 | — | Normal browser selection/find rendering. | [MDN ::highlight()][ref-highlight] [MDN Baseline compatibility][ref-baseline] |
| custom-properties | Widely available | August 2026 | — | Literal default declarations are available, but semantic custom properties are the preferred interface. | [MDN CSS custom properties][ref-custom-properties] [MDN Baseline compatibility][ref-baseline] |
| customizable-select | Limited availability — enhancement only | August 2026 | — | Native select. | [MDN appearance][ref-appearance] [MDN ::picker][ref-picker] [MDN Baseline compatibility][ref-baseline] |
| dynamic-viewport-units | Widely available | August 2026 | — | min-block-size with normal document flow. | [MDN viewport length units][ref-viewport-units] [MDN Baseline compatibility][ref-baseline] |
| field-sizing | Newly available — verify floor | August 2026 | December 2028 | Explicit logical sizes. | [MDN field-sizing][ref-field-sizing] [MDN Baseline compatibility][ref-baseline] |
| flexbox | Widely available | August 2026 | — | Block flow. | [MDN flex alignment][ref-flex-align] [MDN Baseline compatibility][ref-baseline] |
| focus-visible | Widely available | August 2026 | — | :focus indicator. | [MDN :focus-visible][ref-focus-visible] [MDN Baseline compatibility][ref-baseline] |
| forced-colors | Widely available | August 2026 | — | Permit user-agent color mapping. | [MDN forced-colors][ref-forced-colors] [MDN system colors][ref-system-colors] [MDN Baseline compatibility][ref-baseline] |
| grid | Widely available | August 2026 | — | Block flow or Flexbox. | [MDN CSS Grid Layout][ref-grid] [MDN Baseline compatibility][ref-baseline] |
| has | Widely available | August 2026 | — | Owner-managed class or data state. | [MDN :has()][ref-has] [MDN Baseline compatibility][ref-baseline] |
| interpolate-size | Limited availability — enhancement only | August 2026 | — | Grid-row or immediate disclosure. | [MDN interpolate-size][ref-interpolate-size] [MDN calc-size()][ref-calc-size] [MDN Baseline compatibility][ref-baseline] |
| light-dark | Newly available — verify floor | August 2026 | November 2026 | prefers-color-scheme token overrides. | [MDN light-dark()][ref-light-dark] [MDN Baseline compatibility][ref-baseline] |
| line-clamp | Limited availability — enhancement only | August 2026 | — | Show full content or provide an explicit disclosure. | [MDN line-clamp][ref-line-clamp] [MDN Baseline compatibility][ref-baseline] |
| logical-properties | Widely available | August 2026 | — | Physical properties for a constrained legacy direction policy. | [MDN logical properties][ref-logical] [MDN Baseline compatibility][ref-baseline] |
| media-state-pseudo-classes | Limited availability — enhancement only | August 2026 | — | Owner-managed state class. | [MDN :playing][ref-playing] [MDN Baseline compatibility][ref-baseline] |
| name-only-container-queries | Newly available — verify floor | August 2026 | November 2028 | Explicit data or variant class. | [MDN @container][ref-container-at] [web.dev platform updates May 2026][ref-webdev-0526] |
| native-nesting | Widely available | August 2026 | — | Flat selectors or a preprocessor in an existing project. | [MDN CSS nesting][ref-nesting] [MDN Baseline compatibility][ref-baseline] |
| oklch | Widely available | August 2026 | — | Precomputed sRGB semantic colors. | [MDN oklch()][ref-oklch] [MDN Baseline compatibility][ref-baseline] |
| open | Newly available — verify floor | August 2026 | November 2028 | Attribute selector or owner state class. | [MDN :open][ref-open] [web.dev platform updates May 2026][ref-webdev-0526] |
| popover | Newly available — verify floor | August 2026 | — | Inline content or an accessible dialog. | [MDN :popover-open][ref-popover-open] [MDN Baseline compatibility][ref-baseline] |
| prefers-contrast | Widely available | August 2026 | — | WCAG-conformant normal theme. | [MDN prefers-contrast][ref-prefers-contrast] [MDN Baseline compatibility][ref-baseline] |
| property | Widely available | August 2026 | — | Untyped custom property or ordinary property transition. | [MDN @property][ref-property] [MDN Baseline compatibility][ref-baseline] |
| reduced-motion | Widely available | August 2026 | — | Low-motion default. | [MDN prefers-reduced-motion][ref-reduced-motion] [MDN Baseline compatibility][ref-baseline] |
| reduced-transparency | Limited availability — enhancement only | August 2026 | — | A solid-surface default. | [MDN prefers-reduced-transparency][ref-reduced-transparency] [MDN Baseline compatibility][ref-baseline] |
| relative-colors | Limited availability — enhancement only | August 2026 | — | Precomputed semantic color token. | [MDN relative colors][ref-relative-colors] [MDN Baseline compatibility][ref-baseline] |
| round | Limited availability — enhancement only | August 2026 | — | Ordinary calc or precomputed value. | [MDN round()][ref-round] [MDN Baseline compatibility][ref-baseline] |
| same-document-view-transitions | Newly available — verify floor | August 2026 | — | Normal state change. | [MDN view-transition-name][ref-view-transition-name] [MDN view-transition-class][ref-view-transition-class] [MDN Baseline compatibility][ref-baseline] |
| scope | Newly available — verify floor | August 2026 | September 2028 | CSS Modules or a documented component root class. | [MDN @scope][ref-scope] [MDN Baseline compatibility][ref-baseline] |
| scroll-driven-animations | Limited availability — enhancement only | August 2026 | — | Static content or ordinary transition. | [MDN scroll-driven animations][ref-scroll-driven] [MDN animation-timeline][ref-animation-timeline] [WebKit guide to scroll-driven animations][ref-webkit-sda] |
| scroll-state-queries | Limited availability — enhancement only | August 2026 | — | Owner-managed state class or no effect. | [MDN scroll-state container queries][ref-scroll-state-queries] [MDN Baseline compatibility][ref-baseline] |
| shape | Limited availability — enhancement only | August 2026 | — | polygon(), border radius, or a static asset. | [MDN shape()][ref-shape] [MDN Baseline compatibility][ref-baseline] |
| size-adjust | Widely available | August 2026 | — | Normal fallback font metrics. | [MDN size-adjust][ref-size-adjust] [MDN Baseline compatibility][ref-baseline] |
| starting-style | Newly available — verify floor | August 2026 | — | Enter without a transition. | [MDN @starting-style][ref-starting-style] [MDN Baseline compatibility][ref-baseline] |
| subgrid | Widely available | August 2026 | — | Explicit local tracks. | [MDN subgrid][ref-subgrid] [MDN Baseline compatibility][ref-baseline] |
| text-box | Newly available — verify floor | August 2026 | — | Normal line box metrics. | [MDN text-box][ref-text-box] [MDN Baseline compatibility][ref-baseline] |
| text-wrap | Newly available — verify floor | August 2026 | — | Normal wrapping. | [MDN text-wrap][ref-text-wrap] [MDN Baseline compatibility][ref-baseline] |
| transition-behavior | Newly available — verify floor | August 2026 | February 2027 | Immediate discrete state change. | [MDN transition-behavior][ref-transition-behavior] [MDN Baseline compatibility][ref-baseline] |
| typed-attr | Limited availability — enhancement only | August 2026 | — | A class, custom property, or ordinary attribute interpreted by the owner. | [MDN attr()][ref-attr] [MDN Baseline compatibility][ref-baseline] |
| user-valid | Widely available | August 2026 | — | Native validity UI and explicit messages. | [MDN :user-valid][ref-user-valid] [MDN :user-invalid][ref-user-invalid] [MDN Baseline compatibility][ref-baseline] |

## Sources

| ID | Source | URL |
|---|---|---|
| ref-accent-color | MDN accent-color | https://developer.mozilla.org/en-US/docs/Web/CSS/accent-color |
| ref-all | MDN all | https://developer.mozilla.org/en-US/docs/Web/CSS/all |
| ref-anchor-module | MDN CSS anchor positioning | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning |
| ref-animate-base | Animate.css v4.1.1 base rules | https://github.com/animate-css/animate.css/blob/4aa415199dd4ed7d877d10343e745e8bbb4b7a0c/source/_base.css |
| ref-animate-docs | Animate.css live documentation (reviewed 2026-09-04) | https://animate.style/ |
| ref-animate-license | Animate.css v4.1.1 license | https://github.com/animate-css/animate.css/blob/4aa415199dd4ed7d877d10343e745e8bbb4b7a0c/LICENSE |
| ref-animate-package | Animate.css v4.1.1 package metadata | https://github.com/animate-css/animate.css/blob/4aa415199dd4ed7d877d10343e745e8bbb4b7a0c/package.json |
| ref-animation-cancel | MDN animationcancel event | https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event |
| ref-animation-end | MDN animationend event | https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event |
| ref-animation-performance | web.dev high-performance CSS animations | https://web.dev/articles/animations-guide |
| ref-animation-timeline | MDN animation-timeline | https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline |
| ref-appearance | MDN appearance | https://developer.mozilla.org/en-US/docs/Web/CSS/appearance |
| ref-ascent-override | MDN ascent-override | https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/ascent-override |
| ref-aspect-ratio | MDN aspect-ratio | https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio |
| ref-attr | MDN attr() | https://developer.mozilla.org/en-US/docs/Web/CSS/attr |
| ref-autoprefixer | Autoprefixer | https://github.com/postcss/autoprefixer |
| ref-backdrop | MDN ::backdrop | https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop |
| ref-baseline | MDN Baseline compatibility | https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility |
| ref-box-sizing | MDN box-sizing | https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing |
| ref-browserslist | Browserslist | https://browsersl.ist/ |
| ref-calc-size | MDN calc-size() | https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size |
| ref-clamp | MDN clamp() | https://developer.mozilla.org/en-US/docs/Web/CSS/clamp |
| ref-color-mix | MDN color-mix() | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix |
| ref-contain-intrinsic-size | MDN contain-intrinsic-size | https://developer.mozilla.org/en-US/docs/Web/CSS/contain-intrinsic-size |
| ref-container-at | MDN @container | https://developer.mozilla.org/en-US/docs/Web/CSS/@container |
| ref-container-queries | MDN container queries | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries |
| ref-container-query-units | MDN container query length units | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries#container_query_length_units |
| ref-content | MDN content | https://developer.mozilla.org/en-US/docs/Web/CSS/content |
| ref-content-visibility | MDN content-visibility | https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility |
| ref-contrast-color | MDN contrast-color() | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/contrast-color |
| ref-corner-shape | MDN corner-shape | https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape |
| ref-css-modules | CSS Modules project | https://github.com/css-modules/css-modules |
| ref-custom-properties | MDN CSS custom properties | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties |
| ref-defined | MDN :defined | https://developer.mozilla.org/en-US/docs/Web/CSS/:defined |
| ref-dir | MDN :dir() | https://developer.mozilla.org/en-US/docs/Web/CSS/:dir |
| ref-disclosure-pattern | WAI disclosure pattern | https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ |
| ref-empty | MDN :empty | https://developer.mozilla.org/en-US/docs/Web/CSS/:empty |
| ref-field-sizing | MDN field-sizing | https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing |
| ref-flex-align | MDN flex alignment | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container |
| ref-focus-visible | MDN :focus-visible | https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible |
| ref-font-display | MDN font-display | https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display |
| ref-font-src | MDN @font-face src | https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src |
| ref-forced-color-adjust | MDN forced-color-adjust | https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust |
| ref-forced-colors | MDN forced-colors | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors |
| ref-function | MDN @function | https://developer.mozilla.org/en-US/docs/Web/CSS/@function |
| ref-grid | MDN CSS Grid Layout | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout |
| ref-has | MDN :has() | https://developer.mozilla.org/en-US/docs/Web/CSS/:has |
| ref-highlight | MDN ::highlight() | https://developer.mozilla.org/en-US/docs/Web/CSS/::highlight |
| ref-if | MDN if() | https://developer.mozilla.org/en-US/docs/Web/CSS/if |
| ref-import | MDN @import | https://developer.mozilla.org/en-US/docs/Web/CSS/@import |
| ref-inert | MDN inert attribute | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert |
| ref-interpolate-size | MDN interpolate-size | https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size |
| ref-is | MDN :is() | https://developer.mozilla.org/en-US/docs/Web/CSS/:is |
| ref-layer | MDN @layer | https://developer.mozilla.org/en-US/docs/Web/CSS/@layer |
| ref-less | Less documentation | https://lesscss.org/ |
| ref-light-dark | MDN light-dark() | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark |
| ref-line-clamp | MDN line-clamp | https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp |
| ref-line-height | MDN line-height | https://developer.mozilla.org/en-US/docs/Web/CSS/line-height |
| ref-logical | MDN logical properties | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values |
| ref-mask | MDN mask | https://developer.mozilla.org/en-US/docs/Web/CSS/mask |
| ref-minmax | MDN minmax() | https://developer.mozilla.org/en-US/docs/Web/CSS/minmax |
| ref-motion-technique | W3C reduced-motion CSS technique C39 | https://www.w3.org/WAI/WCAG22/Techniques/css/C39 |
| ref-nesting | MDN CSS nesting | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting |
| ref-not | MDN :not() | https://developer.mozilla.org/en-US/docs/Web/CSS/:not |
| ref-nth-child | MDN :nth-child() | https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child |
| ref-object-fit | MDN object-fit | https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit |
| ref-oklch | MDN oklch() | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch |
| ref-open | MDN :open | https://developer.mozilla.org/en-US/docs/Web/CSS/:open |
| ref-overscroll-behavior | MDN overscroll-behavior | https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior |
| ref-picker | MDN ::picker | https://developer.mozilla.org/en-US/docs/Web/CSS/::picker |
| ref-playing | MDN :playing | https://developer.mozilla.org/en-US/docs/Web/CSS/:playing |
| ref-pointer-events | MDN pointer-events | https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events |
| ref-popover-open | MDN :popover-open | https://developer.mozilla.org/en-US/docs/Web/CSS/:popover-open |
| ref-postcss | PostCSS documentation | https://postcss.org/ |
| ref-prefers-contrast | MDN prefers-contrast | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast |
| ref-property | MDN @property | https://developer.mozilla.org/en-US/docs/Web/CSS/@property |
| ref-reduced-motion | MDN prefers-reduced-motion | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion |
| ref-reduced-transparency | MDN prefers-reduced-transparency | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency |
| ref-relative-colors | MDN relative colors | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors |
| ref-repeat | MDN repeat() | https://developer.mozilla.org/en-US/docs/Web/CSS/repeat |
| ref-round | MDN round() | https://developer.mozilla.org/en-US/docs/Web/CSS/round |
| ref-sass | Sass documentation | https://sass-lang.com/documentation/ |
| ref-scope | MDN @scope | https://developer.mozilla.org/en-US/docs/Web/CSS/@scope |
| ref-scripting | MDN scripting media feature | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/scripting |
| ref-scroll-driven | MDN scroll-driven animations | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations |
| ref-scroll-margin-top | MDN scroll-margin-top | https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top |
| ref-scroll-state-queries | MDN scroll-state container queries | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_conditional_rules/Container_scroll-state_queries |
| ref-scrollbar-gutter | MDN scrollbar-gutter | https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter |
| ref-shape | MDN shape() | https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape/shape |
| ref-sibling-count | MDN sibling-count() | https://developer.mozilla.org/en-US/docs/Web/CSS/sibling-count |
| ref-sibling-index | MDN sibling-index() | https://developer.mozilla.org/en-US/docs/Web/CSS/sibling-index |
| ref-size-adjust | MDN size-adjust | https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust |
| ref-starting-style | MDN @starting-style | https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style |
| ref-state | MDN :state() | https://developer.mozilla.org/en-US/docs/Web/CSS/:state |
| ref-stylelint | Stylelint documentation | https://stylelint.io/ |
| ref-subgrid | MDN subgrid | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid |
| ref-supports | MDN @supports | https://developer.mozilla.org/en-US/docs/Web/CSS/@supports |
| ref-system-colors | MDN system colors | https://developer.mozilla.org/en-US/docs/Web/CSS/system-color |
| ref-table-layout | MDN table-layout | https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout |
| ref-tailwind-directives | Tailwind CSS functions and directives | https://tailwindcss.com/docs/functions-and-directives |
| ref-tailwind-theme | Tailwind CSS theme variables | https://tailwindcss.com/docs/theme |
| ref-text-box | MDN text-box | https://developer.mozilla.org/en-US/docs/Web/CSS/text-box |
| ref-text-wrap | MDN text-wrap | https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap |
| ref-transition-behavior | MDN transition-behavior | https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior |
| ref-user-invalid | MDN :user-invalid | https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid |
| ref-user-valid | MDN :user-valid | https://developer.mozilla.org/en-US/docs/Web/CSS/:user-valid |
| ref-view-transition-at | MDN @view-transition | https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition |
| ref-view-transition-class | MDN view-transition-class | https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-class |
| ref-view-transition-name | MDN view-transition-name | https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name |
| ref-viewport-units | MDN viewport length units | https://developer.mozilla.org/en-US/docs/Web/CSS/length#relative_length_units_based_on_viewport |
| ref-wcag-animation | WCAG animation from interactions | https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html |
| ref-wcag-contrast | WCAG 2.2 contrast minimum understanding | https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html |
| ref-wcag-focus | WCAG 2.2 focus visible understanding | https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html |
| ref-wcag-pause | WCAG pause stop hide | https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html |
| ref-wcag-reflow | WCAG 2.2 reflow understanding | https://www.w3.org/WAI/WCAG22/Understanding/reflow.html |
| ref-webdev-0526 | web.dev platform updates May 2026 | https://web.dev/blog/web-platform-05-2026 |
| ref-webdev-css-performance | web.dev optimize CSS | https://web.dev/articles/optimize-css |
| ref-webdev-fonts | web.dev font best practices | https://web.dev/articles/font-best-practices |
| ref-webkit-sda | WebKit guide to scroll-driven animations | https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css |
| ref-where | MDN :where() | https://developer.mozilla.org/en-US/docs/Web/CSS/:where |

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