# MinimalShop Design System

## 1. Project brief

MinimalShop is the storefront of a modular e-commerce platform for small sellers: catalogue,
cart, checkout with an external payment provider, and a minimal seller panel. The visual
direction is a printed editorial catalogue — "paper and ink" — warm, quiet, mostly typographic.
Glass is the only decorative layer, and it exists only where something floats above content.

Stack: Next.js (App Router) + React + TypeScript (strict) + CSS Modules.
Tokens live in `styles/tokens.css` as CSS custom properties. No utility framework.

## 2. Principles

1. **Content first.** Product and price lead; the interface steps back.
2. **Rules for structure, glass for the floating layer.** Hierarchy in the content layer comes
   from 1px hairlines and space. Glass marks elevation, never content.
3. **One action accent.** Ink for the primary action, pine for secondary. No purple, no
   decorative gradients.
4. **Accessible by default.** WCAG 2.2 AA is the floor, 44px targets, focus always visible,
   everything operable by keyboard.
5. **Complete states.** Loading, empty and error are designed before any mockup.
6. **Role differentiation.** Buyer = top navigation and air. Seller and superadmin = sidebar
   and compact density.
7. **Motion is quiet editorial.** Every animation answers "where did this come from?". Prefer
   short fades and small rises over spectacle; never entertain for its own sake.

## 3. Color tokens

| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| `--color-paper` | `#F7F4EE` | Page background | base |
| `--color-surface` | `#FFFDF9` | Cards, forms, tables | base |
| `--color-ink` | `#1B1A17` | Text, primary button, icons | 15.85:1 on paper (AAA) |
| `--color-ink-soft` | `#55514A` | Secondary text, help | 7.19:1 (AAA) |
| `--color-pine` | `#1F5C4A` | Links, secondary action, success, primary hover | 7.12:1 (AAA) |
| `--color-saffron` | `#E3A81F` | Focus ring and highlights only. Never text on paper | 8.19:1 on ink, 1.93:1 on paper |
| `--color-error` | `#B3261E` | Errors, destructive actions | 5.95:1 (AA) |
| `--color-warn` | `#7A5200` | Pending, low stock | 6.30:1 (AA) |
| `--color-border` | `#8C8577` | Input and control borders | 3.33:1 (min 3:1 for components) |
| `--color-line` | `#D9D3C7` | Decorative hairlines only | decorative |

Tints: `--tint-pine #E2EFE9` (text `#17493A`), `--tint-error #FBE4E1` (text `#8F1D17`),
`--tint-warn #FBEFD0` (text `#6B4600`).

Rules: rough proportion 70% paper/surface, 25% ink, 5% accents. Color is never the only carrier
of meaning — every state carries icon and text. Dark mode is out of scope for 1.0; tokens are
named by role so it can be added without touching components.

## 4. Glass: Liquid Glass + Crystal Glass

**The law (from Apple's Liquid Glass).** Glass is a distinct functional layer for controls and
navigation that floats above content without obscuring it. Therefore:

- Glass is allowed only on floating surfaces: navigation bar, sticky filter bar, dialog, sheet,
  mobile bottom bar, toast, chip, price tag, and a small featured card floating on the hero
  photograph.
- Glass never covers body text, never wraps a list, a table or a product description.
- Never glass on glass. At most **two liquid surfaces** visible at once (e.g. nav + filter bar,
  nav + bottom bar, nav + dialog).
- Crystal tags repeat as one system: at most one price tag and one status chip per product
  card or category tile, and one row of category chips. They always sit on photography or on
  paper, never on another glass surface.
- Glass on a photograph always uses the strong surface (`--glass-surface-strong`).
- Glass carries no meaning by itself; the label and icon do.

**Two finishes of the same material.**

- `glass--liquid` (Apple reading): fluid, adaptive, larger blur, vertical body tint, specular
  sheen and a refracted rim brightest at the top-left. Use for navigation bar, dialogs, sheets,
  sticky filter bar, mobile bottom bars, the hero featured card.
- `glass--crystal` (OPPO ColorOS 16 reading): crisper, sharper specular edge, higher saturation,
  less blur, one diagonal streak and a faceted conic rim. Use for chips, price tags, status
  tags, category labels, toasts, small floating controls.

| Token | Value | Use |
| --- | --- | --- |
| `--glass-surface` | `rgba(255, 253, 249, 0.64)` | Liquid / crystal base |
| `--glass-surface-strong` | `rgba(255, 253, 249, 0.8)` | Glass over photography or dense text |
| `--glass-tint-top` / `--glass-tint-bottom` | `rgba(255,255,255,.5)` / `rgba(255,253,249,.18)` | Liquid body gradient |
| `--glass-rim` / `--glass-rim-soft` | `rgba(255,255,255,.9)` / `rgba(255,255,255,.15)` | Refracted 1px rim (mask ring) |
| `--glass-border` | `rgba(255, 255, 255, 0.55)` | Inner edge, liquid |
| `--glass-edge-crystal` | `rgba(255, 255, 255, 0.75)` | Harder inner edge, crystal |
| `--glass-highlight` | `rgba(255, 255, 255, 0.35)` | Specular highlight |
| `--glass-blur` | `20px` liquid / `10px` crystal | Backdrop blur |
| `--glass-saturate` | `180%` liquid / `140%` crystal | Backdrop saturation |
| `--glass-radius` | `12px` liquid / `10px` crystal | Corner radius |
| `--glass-fallback` | `#FFFDF9` | Opaque replacement |

Recipe, liquid: `backdrop-filter: blur(20px) saturate(180%)`, background `--glass-surface`,
1px inner edge in `--glass-border`, specular overlay from 160deg fading at 40%, radius 12px.

Recipe, crystal: `backdrop-filter: blur(10px) saturate(140%)`, background `--glass-surface`,
1px inner edge in `--glass-edge-crystal`, one diagonal specular streak plus a soft conic
highlight, radius 10px.

Rules: text on glass keeps 4.5:1 against the lightest background it can sit on; over photography
switch to `--glass-surface-strong`; never animate the blur; with `prefers-reduced-transparency`,
`forced-colors`, or no `backdrop-filter` support, use `--glass-fallback`.

## 5. Typography

| Role | Family | Weights | Where |
| --- | --- | --- | --- |
| UI and body | Atkinson Hyperlegible Next | 400, 700 | Text, forms, buttons, navigation |
| Headings and product names | Newsreader | 500, 600 italic | H1–H3, product titles, wordmark |
| Data | IBM Plex Mono, `tabular-nums` | 500 | Prices, SKU, order numbers, quantities |

Load with `next/font` (self-hosted, `display: swap`), only the weights above.

| Level | Size / line-height | Family |
| --- | --- | --- |
| Display (H1) | 2.5rem / 3rem | Newsreader 600 |
| H2 | 2rem / 2.5rem | Newsreader 600 |
| H3 | 1.5rem / 2rem | Newsreader 500 |
| Body | 1rem / 1.5rem | Atkinson 400 |
| Small (minimum) | 0.875rem / 1.25rem | Atkinson 400 |
| Price | 1.5rem / 2rem | Plex Mono 500 |
| Button | 1rem / 1.5rem | Atkinson 700 |

Everything in `rem`. Reading width max 68 characters. Left aligned, never justified.

## 6. Space, shape, grid

- Spacing base 4px: 4, 8, 12, 16, 24, 32, 48, 64.
- Radius: 2px controls, 6px cards, 10px crystal glass, 12px liquid glass.
- Border 1px. Shadow only on floating layers, and there the glass already does the separation.
- Grid: 12 columns, max container 1200px, margins 16px mobile to 48px desktop.
- Breakpoints: 360, 768, 1024. Reflow down to 320px without horizontal scroll.
- Icons: Lucide only, 1.5px stroke, always paired with text on primary actions.

## 7. Motion

Quiet editorial motion audited from three references. Borrow timing and craft — not their
brand, dark UI, marketing pills, or decorative hero overlays.

| Reference | Role for MinimalShop |
| --- | --- |
| [KORVAE (Framer)](https://welcome-violet-282498.framer.app) | Principal: component enter, link microinteractions, asymmetric composition |
| [Almada Label](https://almadalabel.com) | Secondary: image-first commerce, underline/opacity hover, product image swap |
| [Ledup](https://ledup.pt) | Scroll: GSAP + ScrollTrigger section reveals, media wipes, glass nav presence |

### Engines

Two engines, split by responsibility. Never mix them on the same element.

- **Motion (motion.dev)** — inside a component: state changes, dialog open, microinteractions,
  list entry. Declarative, tied to React lifecycle.
- **GSAP + ScrollTrigger** — across elements: staggered catalogue entry, scroll-linked
  reveals, checkout step transitions, media wipes.

### Two entrance distances (do not mix)

| Kind | Travel | Duration | Ease | Engine | Source |
| --- | --- | --- | --- | --- | --- |
| Component enter | `y: 8` → `0`, `opacity: 0` → `1` | **340ms** (`--duration-enter`) | `--ease-out-quart` | Motion | KORVAE |
| Scroll reveal | `y: 24` → `0`, `autoAlpha: 0` → `1` | **900ms** (`--duration-scroll-reveal`) | `--ease-power3-out` / GSAP `power3.out` | GSAP + ST | Ledup |

Scroll reveal defaults: stagger **80–120ms** (canonical **0.12s**), ScrollTrigger
`start: "clamp(top 75%)"` (`SCROLL_START` in `lib/motion/gsap.ts`), replay on `onEnter` /
`onEnterBack`, reset when the section leaves the viewport. Content already past the start at
load is revealed immediately. Optional media enter: `scale: 0.9` → `1` with the same scroll
recipe.

> Tuned from Ledup's `top center-=200px`: on a storefront that start left most of the viewport
> blank until a section reached the upper third, and sections near the end of the page could
> never reach it. `clamp()` keeps every section reachable.

Never animate content that streams inside a `<Suspense>` boundary with GSAP: it can be styled
before React hydrates it and cause a hydration mismatch.

### Scale

| Scale | Duration | Engine | Example | Source |
| --- | --- | --- | --- | --- |
| Micro | 120–180ms | Motion | Link `color`, underline draw, quantity | KORVAE links 180ms |
| Component | 200–340ms | Motion | Dialog, toast, filters, component enter | KORVAE enter 340ms |
| Sequence | 400–700ms | GSAP | Staggered grid entry (stagger 80–120ms) | Ledup stagger craft |
| Scroll | 600–900ms (canonical **900**) | GSAP + ST | Section reveal on home / catalogue | Ledup |
| Media wipe | 600ms | GSAP | Hero / gallery `clip-path` wipe | Ledup `power3.inOut` |

Product image swap (Almada): `filter` (and/or opacity) **300ms**, optional **100ms** delay —
never a lift or shadow.

### Easings and tokens

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out-quart` | `cubic-bezier(0.22, 1, 0.36, 1)` | Component enter, micro, most UI |
| `--ease-power3-out` | `cubic-bezier(0.215, 0.61, 0.355, 1)` | Scroll reveals (GSAP `power3.out` approx) |
| `--ease-power3-in-out` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | Media wipes (GSAP `power3.inOut` approx) |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Move between two settled positions |
| `--motion-enter-y` | `8px` | Component enter travel |
| `--motion-scroll-y` | `24px` | Scroll reveal travel |
| `--motion-stagger-min` / `--motion-stagger-max` | `80ms` / `120ms` | Sequence and scroll stagger |

In GSAP timelines prefer named easings `power3.out`, `power3.inOut`, `power2.out` to match
Ledup; keep CSS/Motion on the cubic-bezier tokens above.

### Allowed properties

Animate only: `opacity` / `autoAlpha`, `transform` (`translate`, `scale` ≤ **1.05**, optional
`rotateX` on advanced editorial line reveals), `clip-path` on media and glass mounts, and
`filter` only for product image swaps.

Never animate `height`, `top`, `width`, `box-shadow`, or glass `backdrop-filter` blur.
Max two concurrent animations per screen. Nothing delays first paint, blocks interaction, or
replaces native scroll (no Lenis). `scrub: true` only for rare, intentional scroll-linked
moments — never as the default page feel.

### `prefers-reduced-motion`

Collapse every sequence to a **120ms** opacity fade (`--duration-reduced`). No `rotateX`, no
scrub, no `clip-path` wipes, no stagger. Scroll remains native.

### Composition cues (layout, not a second brand)

Borrowed from the references without changing paper/ink tokens or glass law:

- **Hero:** one asymmetric composition (copy + dominant photography), generous air, hairlines —
  KORVAE. Brand/wordmark stays a hero-level signal.
- **Catalogue:** image-first product cards; small meta (category, price) then title — KORVAE /
  Almada. `ProductCard` still forbids hover lift and nested links; hover is opacity or underline only.
- **Nav:** sticky liquid glass floating over content — Ledup presence, Apple liquid recipe.
- **No** sticker/badge overlays on hero media, no marketing pill clusters, no glass under body copy.

Helpers live in `lib/motion/` (`fadeRise` for component enter; GSAP scroll reveal helper for
sections). Durations and travel distances are tokens in `styles/tokens.css`.

## 8. Components

| Component | Variants | Tokens | Never |
| --- | --- | --- | --- |
| `Button` | primary (ink), secondary (pine border), tertiary (text), danger | `--color-ink`, `--color-pine`, `--space-*`, `--radius-sm` | No gradients, no icon-only primary, no external margin |
| `Field` | text, number, select, radio, checkbox | `--color-border`, `--tint-error` | Label is always visible; no placeholder as label |
| `ProductCard` | normal, out of stock, pre-sale, low stock, loading | `--color-surface`, `--color-line`, `--radius-md`, crystal price tag + status chip on the photo | No shadow, no hover lift; hover = image filter / underline only; no nested link; broken photo falls back to the typographic placeholder (`ProductImage`) |
| `PriceTag` | normal, struck, large | Plex Mono, `--color-ink` | Never hardcode currency; use `Intl.NumberFormat('es-CO')` |
| `StatusChip` | pending, paid, shipped, delivered, failed, cancelled | `--tint-*` | Never color only; icon + text always |
| `QuantityStepper` | compact, normal | `--space-*`, `--radius-sm` | No stepper without an editable numeric field |
| `Pagination` | numbered | `--color-ink`, `--color-line` | Never infinite scroll on the catalogue |
| `Dialog` | confirm, form | `glass--liquid`, `--glass-surface` | Never full-screen on desktop, never nested |
| `Toast` | success, error | `glass--crystal` | Never auto-dismiss an error |
| `DataTable` | orders, products | `--color-line`, `--color-surface` | No glass, no horizontal scroll on mobile (becomes cards) |
| `GlassSurface` | liquid, crystal | `--glass-*` | Never wraps content blocks |

## 9. Layout patterns

- Buyer: top navigation (glass), content column, footer.
- Seller and superadmin: sidebar (glass), dense content, `DataTable` first.
- Catalogue: 12 per page, numbered pagination, "Showing X to Y of Z"; image-first cards.
- Home / promotional surfaces: one composition in the first viewport — brand, one headline,
  one supporting line, one CTA group, one dominant image plane (see §7 composition cues).
- Checkout: single column of fields plus a sticky summary; the cart never loses data on error.
- Every list has three states: skeleton with final dimensions, empty with a useful action,
  error with a plain-language message and a retry button.

## 10. Accessibility

- `lang="es-CO"`, one `h1` per screen, landmarks `header`, `nav`, `main`, `aside`, `footer`.
- "Skip to content" as the first focusable element.
- Focus ring: 2px ink plus 3px saffron, 2px offset, valid on paper and on ink.
- Tab order matches visual order, no positive `tabindex`, no keyboard traps.
- Dynamic changes announced in an `aria-live="polite"` region.
- `autocomplete` on every form field; never ask for data already given.
- Text on glass keeps 4.5:1; with `prefers-reduced-transparency` or `forced-colors` it falls
  back to the opaque surface.
- With `prefers-reduced-motion` there is no parallax and no hijacked scroll.

## 11. DON'Ts

- No Tailwind, no styled-components, no CSS-in-JS runtime. CSS Modules only.
- No Inter, Roboto, Arial, Space Grotesk or system-ui as the product voice.
- No purple gradients, no glassmorphism-as-decoration, no glass on glass.
- No glass under body copy, tables, forms or product descriptions.
- No hardcoded hex, spacing, radius or duration: if a value repeats, it is a token.
- No new dependency, icon set or animation library without approval.
- No `any`, no non-null assertion to silence TypeScript, no `useEffect` for data fetching.
- No full-screen spinners, no layout shift between skeleton and content.
- No infinite scroll on the catalogue and no auto-dismissed error toasts.
- No dark mode in 1.0.

## 12. Verification before calling UI done

1. Are all colors, spaces, radii and durations tokens? (`rg` for `#` in the diff)
2. Does glass appear only on floating surfaces, at most twice per screen?
3. Keyboard: tab through the whole screen, focus visible, Esc closes overlays.
4. axe clean, contrast checked on paper and on glass.
5. Motion: component enter uses 8px/340ms; scroll reveal uses 24px/900ms; reduced-motion is a
   120ms fade with native scroll; no engine mix on one element.
6. Responsive at 360, 768 and 1024; no horizontal scroll at 320.
7. Compare against the Figma frame; deviations need design approval.