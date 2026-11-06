/**
 * Shared easings and durations — mirror CSS tokens in styles/tokens.css.
 * Motion (motion.dev) for in-component animation; GSAP + ScrollTrigger for sequences/scroll.
 * Never use both engines on the same element.
 *
 * Sources: KORVAE (component enter), Ledup (scroll / power3), DESIGN.md §7.
 */

/** KORVAE / component enter — CSS `--ease-out-quart`. */
export const easeOutQuart = [0.22, 1, 0.36, 1] as const;

/** Ledup power3.out approx — CSS `--ease-power3-out`. */
export const easePower3Out = [0.215, 0.61, 0.355, 1] as const;

/** Ledup power3.inOut approx — CSS `--ease-power3-in-out` (media wipes). */
export const easePower3InOut = [0.645, 0.045, 0.355, 1] as const;

export const easeInOut = [0.65, 0, 0.35, 1] as const;

/** GSAP named easings (prefer these inside GSAP timelines). */
export const gsapEase = {
  power3Out: 'power3.out',
  power3InOut: 'power3.inOut',
  power2Out: 'power2.out',
} as const;

export const duration = {
  microMin: 0.12,
  microMax: 0.18,
  componentMin: 0.2,
  componentMax: 0.34,
  /** KORVAE canonical component enter. */
  enter: 0.34,
  sequenceMin: 0.4,
  sequenceMax: 0.7,
  scrollMin: 0.6,
  scrollMax: 0.9,
  /** Ledup canonical section reveal. */
  scrollReveal: 0.9,
  mediaWipe: 0.6,
  mediaSwap: 0.3,
  mediaSwapDelay: 0.1,
  reduced: 0.12,
} as const;

export const travel = {
  /** Component enter (Motion) — `--motion-enter-y`. */
  enterY: 8,
  /** Scroll reveal (GSAP) — `--motion-scroll-y`. */
  scrollY: 24,
} as const;

export const stagger = {
  min: 0.08,
  max: 0.12,
  /** Ledup canonical scroll stagger. */
  scroll: 0.12,
} as const;
