<!-- Generated from content/. Edit canonical files and run npm run build. -->

# 10. Experimental / watchlist

Use this section to recognize a capability, not to make it load-bearing. A feature here needs a working baseline, a narrow `@supports`/browser-floor check, and a reason it improves this product.

| Capability | Use only when | Baseline fallback |
|---|---|---|
| Typed `attr()` | A typed attribute is a local convenience | Class, custom property, or owner logic |
| Customizable `<select>` | Native select semantics remain intact | Native select |
| `corner-shape` | Decorative geometry choice; `shape()` itself is newly available 2026 and may be used behind a real product-floor check | `polygon()`, `border-radius`, asset |
| Media state pseudo-classes | Media effect is optional | Owner-managed state |
| `::highlight()` | Custom range/search treatment as a progressive enhancement — newly available 2026, not the baseline path | Browser selection/find treatment |
| Scroll-state queries | Scroll affordance is optional | No effect or owner state |
| `round()` | A value needs visual snapping | Ordinary `calc()` / precomputed value |
| `@function`, `if()`, sibling functions | Build/runtime baseline already works | Build-time or owner-calculated value |

These features carry distinct support stories; do not collapse them into a vague "modern CSS" label. [MDN attr()][ref-attr] [MDN shape()][ref-shape] [MDN corner-shape][ref-corner-shape] [MDN :playing][ref-playing] [MDN ::highlight()][ref-highlight] [MDN scroll-state queries][ref-scroll-state-queries] [MDN round()][ref-round] [MDN if()][ref-if] [MDN @function][ref-function] [MDN sibling-index()][ref-sibling-index] [MDN sibling-count()][ref-sibling-count]

## Native state that still needs a contract

`:defined`, custom-element `:state()`, and `@media (scripting)` can improve an existing component contract. Do not use them to hide required content while JavaScript initializes; the semantic/default DOM must remain useful. [MDN :defined][ref-defined] [MDN :state()][ref-state] [MDN scripting media feature][ref-scripting]

## Modernize by intent

| Retire | Prefer | Reason |
|---|---|---|
| Padding-ratio wrapper | `aspect-ratio` | Native intrinsic media sizing |
| `max-height` disclosure guess | Semantic no-motion disclosure; optional grid-row enhancement | Unknown height, focus, and hidden state remain correct |
| Margin gutters / `space-between` cards | Grid `auto-fit` + `gap` | Natural wrapping and consistent gaps |
| Global `* + *` | Scoped flow selector | Avoid third-party/component leakage |
| Strict branded `local()` source | Versioned webfont + fallback metrics | Avoid unknown installed font versions |
| JavaScript class for local parent state | Scoped `:has()` | Less state synchronization when support fits |

Keep the generated compatibility projection current. Promotion from Newly available to Widely available does not remove the need for accessibility, performance, and product-floor testing.

## Capability guidance

### Experimental Css

- **Recommendation:** Keep limited and experimental capabilities out of load-bearing paths until the product browser floor and a viable fallback are proven.
- **Use when:** An optional visual or authoring improvement has clear isolated value.
- **Avoid when:** Navigation, semantics, core layout, validation, or required content depends on it.
- **Fallback:** A complete static/native baseline or owner-managed state.
- **Accessibility checks:** keyboard, reduced-motion, zoom-reflow
- **Performance:** Profile actual browser behavior before broad use.

# Reference index

[ref-attr]: https://developer.mozilla.org/en-US/docs/Web/CSS/attr
[ref-corner-shape]: https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape
[ref-defined]: https://developer.mozilla.org/en-US/docs/Web/CSS/:defined
[ref-function]: https://developer.mozilla.org/en-US/docs/Web/CSS/@function
[ref-highlight]: https://developer.mozilla.org/en-US/docs/Web/CSS/::highlight
[ref-if]: https://developer.mozilla.org/en-US/docs/Web/CSS/if
[ref-playing]: https://developer.mozilla.org/en-US/docs/Web/CSS/:playing
[ref-round]: https://developer.mozilla.org/en-US/docs/Web/CSS/round
[ref-scripting]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/scripting
[ref-scroll-state-queries]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_conditional_rules/Container_scroll-state_queries
[ref-shape]: https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape/shape
[ref-sibling-count]: https://developer.mozilla.org/en-US/docs/Web/CSS/sibling-count
[ref-sibling-index]: https://developer.mozilla.org/en-US/docs/Web/CSS/sibling-index
[ref-state]: https://developer.mozilla.org/en-US/docs/Web/CSS/:state
