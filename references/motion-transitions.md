<!-- Generated from content/. Edit canonical files and run npm run build. -->

# 6. Motion & transitions

## Motion is feedback, not required content

Choose static state first, a native transition/keyframe for a small bespoke effect, or an approved Animate.css preset for a repeated entrance/emphasis effect. Do not add a library for one opacity change. Animate named properties, not `transition: all`; prefer transform/opacity when suitable, but measure rather than promising compositor acceleration or a frame rate. [web.dev animation performance][ref-animation-performance]

```css
/* The ordinary control works without motion or media-query support. */
@media (prefers-reduced-motion: no-preference) {
  .button {
    transition: background-color 160ms ease, color 160ms ease;
  }
}
```

Scope motion policy to the owning components. Do not prescribe a universal near-zero-duration reset: it can leave delays intact and still run an effect. The no-motion state must be immediately useful. Keep non-essential interaction motion disableable; this is the skill's default policy, not a claim that WCAG's AAA animation criterion is an AA requirement. Provide appropriate pause/stop/hide controls for qualifying automatically moving content. [W3C reduced-motion technique][ref-motion-technique] [WCAG animation from interactions][ref-wcag-animation] [WCAG pause, stop, hide][ref-wcag-pause]

## Animate.css: optional reference, not a default dependency

**Evidence reviewed 2026-09-04:** the examples target **v4.1.1**, tag commit `4aa415199dd4ed7d877d10343e745e8bbb4b7a0c`, not an assertion about the newest npm release. The live documentation and the tagged artifact have different license statements: the website says Hippocratic, while this tag's `LICENSE` and `package.json` say MIT. Inspect the exact installed/distributed artifact and obtain the project's dependency/license approval; do not generalize either label to every version or copy library code into this skill. [Animate.css documentation][ref-animate-docs] [Versioned license][ref-animate-license] [Versioned package metadata][ref-animate-package]

### Integration and ownership

Inspect the existing dependency and stylesheet owner first. Only after `allow_dependency_changes=true` and version/license approval, an npm project may use:

```sh
npm install --save-exact animate.css@4.1.1
```

Use the equivalent command for the detected manager; do not create a second lockfile. Import once at the framework's permitted global CSS entry point:

```js
import 'animate.css';
```

Keep the library's classes global when using CSS Modules. With a layered CSS import, use a top-level `@import ... layer(vendor)` before rule blocks, as in the architecture module; do not also import the unlayered copy. Bare package imports require a supporting bundler, not a browser URL. For a CDN integration, follow the project's CSP and integrity policy and pin the reviewed artifact; do not invent an SRI hash.

### Entrance example with a static baseline

This example is entrance-only; the message remains visible without the stylesheet. Application logic owns rendering and any live-region announcement.

```html
<p class="feedback animate__animated animate__fadeIn">Preferences saved.</p>
```

```css
.feedback.animate__animated {
  --animate-duration: var(--motion-feedback-duration, 160ms);
}

@media print, (prefers-reduced-motion: reduce) {
  .feedback.animate__animated {
    /* Deliberately stronger than vendor motion rules, never re-enables motion. */
    animation: none !important;
    transition: none !important;
    animation-delay: 0s !important;
    transition-delay: 0s !important;
    opacity: 1;
    transform: none;
  }
}
```

The default v4 classes use the `animate__` prefix. Duration, delay, and repetition helpers use `--animate-duration`, `--animate-delay`, and `--animate-repeat`; setting the latter two variables alone does not apply a delay or repeat without matching helpers/longhands. `animate__infinite` is not bounded by `--animate-repeat`. Upstream v4.1.1 reduces durations to 1ms and iterations to one for reduced motion/print, but its base rule does not clear `animation-delay`. Do not remove upstream preference handling, and do not assume a shortened effect is equivalent to no motion. [Versioned base rules][ref-animate-base]

Without delay/repeat helpers, the entrance uses the CSS defaults: zero delay and one iteration. Do not override delay or repetition variables/longhands in the normal-motion feedback rule; this preserves inherited timing tokens and the library's delay, repeat, and infinite helpers. The stronger no-animation and zero-delay overrides remain scoped to reduced motion and print.

Keep the feedback wrapper free of unrelated transforms. Avoid root-page motion, flashing attention seekers, uncontrolled infinite loops, clipped focus outlines, and layout shifts. Inspect overflow locally; a global `overflow: hidden` workaround can conceal real content. Use tokens for product-specific timing rather than making the example duration a universal requirement.

### Lifecycle, delivery, and migration gates

Do not copy a Promise helper that waits only for `animationend`: an aborted/removed animation may never emit it. State completion, navigation, form submission, focus, and content availability must not depend on cosmetic completion. [MDN animationend][ref-animation-end]

When JavaScript orchestration is genuinely necessary, register listeners before starting; filter `event.target`, `event.animationName` (for example `fadeIn`, not the class `animate__fadeIn`), and pseudo-element events. Handle `animationcancel` where supported, explicit abort/unmount, absent CSS, zero motion, and a finite timeout watchdog. Settle once and remove only owned classes/listeners/timers on every path. A newer effect must not be cleaned up by an older callback; cancel/replace it under component ownership. Test preference changes during playback and rapid re-entry. Never stop propagation just to make a helper work. [MDN animationcancel][ref-animation-cancel]

Measure the production CSS delta; importing a full stylesheet does not imply per-animation tree shaking. For a subset, use a reviewed custom build that retains required base rules, prefixes, keyframes, and preference handling; verify the final output. Safelist dynamically selected animation classes only where the actual CSS-removal tooling needs it. Do not clone mutable upstream HEAD or execute its build scripts blindly.

For a v3-to-v4 migration, inventory legacy `animated`/effect classes, imports, helpers, and keyframe references; migrate one owned component at a time and test it. Do not load prefixed and compatibility builds together or rename unrelated classes globally. Roll back this task's import, manifest, lockfile, and class changes as one unit. This skill adds references only; it does not install or vendor Animate.css.

## Disclosure: semantics before interpolation

A collapsed grid row or `overflow: hidden` does not by itself remove links/controls from keyboard focus. Prefer a native disclosure with a complete no-animation baseline:

```html
<details class="disclosure">
  <summary>Delivery details</summary>
  <div class="disclosure__panel">Delivery information goes here.</div>
</details>
```

For a custom disclosure, put `aria-expanded` on the actual button, connect it to the panel, and synchronize `hidden`/`inert` with visibility and focus handling. Use grid-row interpolation only as an enhancement over that state contract, not as its replacement. Do not animate a focused panel closed without managing focus. [WAI disclosure pattern][ref-disclosure-pattern] [MDN inert][ref-inert]

`interpolate-size` and `calc-size()` are Limited availability in the recorded compatibility snapshot. Preserve ordinary open/closed behavior without interpolation and check the product floor. [MDN interpolate-size][ref-interpolate-size] [MDN calc-size()][ref-calc-size]

## Top-layer entrances and discrete state

`@starting-style` and `transition-behavior: allow-discrete` can enhance a semantic popover/dialog. Keep visible open state as the default and make motion opt-in. [MDN @starting-style][ref-starting-style] [MDN transition-behavior][ref-transition-behavior]

```css
[popover]:popover-open { opacity: 1; }

@media (prefers-reduced-motion: no-preference) {
  [popover] {
    transition: opacity 160ms ease;
  }

  @starting-style {
    [popover]:popover-open { opacity: 0; }
  }
}
```

This example enhances entrances only; it does not claim an exit animation. Exits involving top-layer removal require testing `display` and `overlay` discrete transitions as well as semantic/focus behavior. Use `@property` only when an animated custom property needs a declared type. [MDN @property][ref-property]

## Progressive visual enhancements

Scroll-driven animations remain Limited availability in the recorded snapshot. Never require them for progress, navigation, or content reveal. [MDN scroll-driven animations][ref-scroll-driven] [WebKit scroll-driven animations][ref-webkit-sda]

Same-document View Transitions may enhance complete navigation/state changes. Preserve immediate behavior and honor reduced motion; cross-document `@view-transition` requires its own floor check. [MDN view-transition-name][ref-view-transition-name] [MDN view-transition-class][ref-view-transition-class] [MDN @view-transition][ref-view-transition-at]

## Capability guidance

### Ordinary Transitions

- **Recommendation:** Transition only deliberate visual properties and respect motion preferences.
- **Use when:** A state change benefits from subtle feedback.
- **Avoid when:** transition: all, decorative motion without a reduced-motion path, or layout-dependent animation by default.
- **Fallback:** An immediate state change.
- **Accessibility checks:** reduced-motion
- **Performance:** Prefer compositor-friendly properties when practical, then profile.

### Disclosure Motion

- **Recommendation:** Use a semantic native or correctly managed custom disclosure baseline; add grid-row or intrinsic-size interpolation only as a verified enhancement.
- **Use when:** Content with unknown height expands and collapses.
- **Avoid when:** Height-only hiding that leaves controls focusable, or max-height guesses that clip content.
- **Fallback:** Open/close without interpolation.
- **Accessibility checks:** reduced-motion, keyboard
- **Performance:** Keep the animated subtree small.

### Scroll Driven Animation

- **Recommendation:** Treat scroll-driven animations as enhancement-only while support remains incomplete.
- **Use when:** The visual effect is optional and has no interaction or comprehension requirement.
- **Avoid when:** Progress, navigation, or required content visibility.
- **Fallback:** Static state or ordinary interaction-driven motion.
- **Accessibility checks:** reduced-motion
- **Performance:** Profile real scroll behavior on target devices.

### View Transitions

- **Recommendation:** Use same-document View Transitions as a progressive enhancement over a complete non-animated navigation/state change.
- **Use when:** Shared visual continuity adds value but is not required.
- **Avoid when:** Cross-document assumptions where the browser floor is incomplete.
- **Fallback:** Normal navigation or state update.
- **Accessibility checks:** reduced-motion
- **Performance:** Avoid excessive named elements and expensive pseudo-element effects.

### Animate Css

- **Recommendation:** Use Animate.css as an optional reference or explicitly approved preset dependency, not an automatic default.
- **Use when:** Repeated entrance or emphasis effects justify an existing or authorized dependency.
- **Avoid when:** Native CSS suffices, dependency/license approval is absent, or correctness would depend on animation completion.
- **Fallback:** Immediate semantic state with visible content and working focus, without the library.
- **Accessibility checks:** reduced-motion, keyboard, print, cancellation, missing-css
- **Performance:** Measure production CSS and runtime cost; do not assume stylesheet tree shaking or compositor acceleration.

# Reference index

[ref-animate-base]: https://github.com/animate-css/animate.css/blob/4aa415199dd4ed7d877d10343e745e8bbb4b7a0c/source/_base.css
[ref-animate-docs]: https://animate.style/
[ref-animate-license]: https://github.com/animate-css/animate.css/blob/4aa415199dd4ed7d877d10343e745e8bbb4b7a0c/LICENSE
[ref-animate-package]: https://github.com/animate-css/animate.css/blob/4aa415199dd4ed7d877d10343e745e8bbb4b7a0c/package.json
[ref-animation-cancel]: https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event
[ref-animation-end]: https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event
[ref-animation-performance]: https://web.dev/articles/animations-guide
[ref-calc-size]: https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size
[ref-disclosure-pattern]: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
[ref-inert]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert
[ref-interpolate-size]: https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size
[ref-motion-technique]: https://www.w3.org/WAI/WCAG22/Techniques/css/C39
[ref-property]: https://developer.mozilla.org/en-US/docs/Web/CSS/@property
[ref-scroll-driven]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations
[ref-starting-style]: https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
[ref-transition-behavior]: https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior
[ref-view-transition-at]: https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition
[ref-view-transition-class]: https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-class
[ref-view-transition-name]: https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name
[ref-wcag-animation]: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
[ref-wcag-pause]: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
[ref-webkit-sda]: https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css
