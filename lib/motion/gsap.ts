/**
 * GSAP helpers for cross-element sequences and scroll-linked reveals.
 * Import GSAP / ScrollTrigger only from this module in feature code.
 *
 * Canonical scroll reveal (Ledup): autoAlpha 0→1, y 24→0, 0.9s, power3.out, stagger 0.12,
 * ScrollTrigger start `clamp(top 75%)`, onEnter + onEnterBack. `clamp()` keeps sections that
 * sit near the end of the page reachable, so they can never stay hidden.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { duration, gsapEase, stagger, travel } from './easings';

/** Default ScrollTrigger start for reveals and media wipes (DESIGN.md §7). */
export const SCROLL_START = 'clamp(top 75%)';

let registered = false;

export function ensureGsapPlugins(): typeof gsap {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return gsap;
}

/** True when the scroller already sits at or beyond the trigger's start position. */
function isPastStart(trigger: ScrollTrigger): boolean {
  return trigger.start <= trigger.scroll() && !trigger.isActive;
}

export interface ScrollRevealOptions {
  readonly trigger?: Element | string;
  readonly start?: string;
  readonly stagger?: number;
  readonly duration?: number;
  readonly y?: number;
  readonly once?: boolean;
  readonly reducedMotion?: boolean;
}

export interface ScrollRevealHandle {
  readonly tweens: gsap.core.Tween[];
  readonly triggers: ScrollTrigger[];
  kill(): void;
}

/**
 * Ledup-style section reveal. Pass the elements to animate; trigger defaults to the first.
 * With `reducedMotion`, applies an instant opacity fade and skips travel/stagger.
 */
export function createScrollReveal(
  targets: gsap.TweenTarget,
  options: ScrollRevealOptions = {},
): ScrollRevealHandle {
  const g = ensureGsapPlugins();
  const elements = gsap.utils.toArray(targets);
  const triggers: ScrollTrigger[] = [];
  const tweens: gsap.core.Tween[] = [];

  if (elements.length === 0) {
    return { tweens, triggers, kill() {} };
  }

  const trigger = options.trigger ?? (elements[0] as Element);
  const reduced = options.reducedMotion === true;

  const hide = (): void => {
    if (reduced) {
      g.set(elements, { autoAlpha: 0, clearProps: 'transform' });
      return;
    }
    g.set(elements, {
      autoAlpha: 0,
      y: options.y ?? travel.scrollY,
    });
  };

  const show = (): void => {
    if (reduced) {
      tweens.push(
        g.to(elements, {
          autoAlpha: 1,
          duration: duration.reduced,
          overwrite: true,
        }),
      );
      return;
    }
    tweens.push(
      g.to(elements, {
        autoAlpha: 1,
        y: 0,
        duration: options.duration ?? duration.scrollReveal,
        ease: gsapEase.power3Out,
        stagger: options.stagger ?? stagger.scroll,
        overwrite: true,
        clearProps: 'transform',
      }),
    );
  };

  hide();

  const vars: ScrollTrigger.StaticVars = {
    trigger,
    start: options.start ?? SCROLL_START,
    onEnter: show,
  };
  if (!options.once) {
    vars.onEnterBack = show;
    vars.onLeave = hide;
    vars.onLeaveBack = hide;
  }

  const main = ScrollTrigger.create(vars);
  triggers.push(main);
  // Already past the start at load (clamped to 0, or a restored scroll): reveal now,
  // otherwise content in the first viewport would wait for a scroll that never comes.
  if (isPastStart(main)) {
    show();
  }

  return {
    tweens,
    triggers,
    kill() {
      for (const tween of tweens) {
        tween.kill();
      }
      for (const st of triggers) {
        st.kill();
      }
      g.set(elements, { clearProps: 'all' });
    },
  };
}

export { gsap, ScrollTrigger };

export interface MotionHandle {
  kill(): void;
}

export interface MediaWipeOptions {
  readonly reducedMotion?: boolean;
  readonly start?: string;
}

/**
 * Ledup media wipe: clip-path reveal from the bottom edge, 600ms power3.inOut, played once.
 * Reduced motion: a 120ms opacity fade, no clip-path.
 */
export function createMediaWipe(
  targets: gsap.TweenTarget,
  options: MediaWipeOptions = {},
): MotionHandle {
  const g = ensureGsapPlugins();
  const elements = gsap.utils.toArray<Element>(targets);
  const triggers: ScrollTrigger[] = [];
  const reduced = options.reducedMotion === true;

  for (const element of elements) {
    const from = reduced
      ? { autoAlpha: 0 }
      : { clipPath: 'inset(100% 0% 0% 0%)' };
    const to = reduced
      ? { autoAlpha: 1, duration: duration.reduced }
      : {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: duration.mediaWipe,
          ease: gsapEase.power3InOut,
        };
    const tween = g.fromTo(element, from, {
      ...to,
      paused: true,
    });
    const st = ScrollTrigger.create({
      trigger: element,
      start: options.start ?? SCROLL_START,
      once: true,
      onEnter: () => {
        tween.play();
      },
    });
    triggers.push(st);
    if (isPastStart(st)) {
      tween.play();
    }
  }

  return {
    kill() {
      for (const st of triggers) {
        st.kill();
      }
      g.set(elements, { clearProps: 'clipPath,opacity,visibility' });
    },
  };
}

export interface HeroIntroOptions {
  readonly reducedMotion?: boolean;
}

/**
 * Home hero intro (KORVAE composition, Ledup craft). Two concurrent animations at most:
 * 1. headline lines rise out of their masks (`[data-hero-line]`), then supporting copy
 *    (`[data-hero-fade]`) follows with the scroll-reveal travel;
 * 2. the dominant image plane (`[data-hero-media]`) wipes in from the bottom edge.
 * Reduced motion collapses everything into a single 120ms fade.
 */
export function createHeroIntro(
  root: Element,
  options: HeroIntroOptions = {},
): MotionHandle {
  const g = ensureGsapPlugins();
  const lines = root.querySelectorAll('[data-hero-line]');
  const fades = root.querySelectorAll('[data-hero-fade]');
  const media = root.querySelector('[data-hero-media]');
  const tl = g.timeline({ defaults: { ease: gsapEase.power3Out } });

  if (options.reducedMotion === true) {
    const all = [...lines, ...fades, ...(media ? [media] : [])];
    tl.from(all, { autoAlpha: 0, duration: duration.reduced });
  } else {
    tl.from(lines, {
      yPercent: 105,
      rotateX: -14,
      transformOrigin: '0% 100%',
      duration: duration.sequenceMax,
      stagger: stagger.min,
    });
    if (media) {
      tl.fromTo(
        media,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: duration.mediaWipe,
          ease: gsapEase.power3InOut,
        },
        stagger.max,
      );
    }
    tl.from(
      fades,
      {
        autoAlpha: 0,
        y: travel.scrollY,
        duration: duration.sequenceMax,
        stagger: stagger.min,
      },
      duration.sequenceMax - stagger.max,
    );
  }

  return {
    kill() {
      tl.kill();
      g.set([...lines, ...fades, ...(media ? [media] : [])], {
        clearProps: 'all',
      });
    },
  };
}

export interface WordRevealOptions {
  readonly reducedMotion?: boolean;
}

/**
 * Editorial headline: each `[data-word]` rises out of its mask with a slight rotateX,
 * then `[data-fade]` siblings follow. Reduced motion: one 120ms fade.
 */
export function createWordReveal(root: Element, options: WordRevealOptions = {}): MotionHandle {
  const g = ensureGsapPlugins();
  const words = root.querySelectorAll('[data-word]');
  const fades = root.querySelectorAll('[data-fade]');
  const tl = g.timeline({ defaults: { ease: gsapEase.power3Out } });

  if (options.reducedMotion === true) {
    tl.from([...words, ...fades], { autoAlpha: 0, duration: duration.reduced });
  } else {
    tl.from(words, {
      yPercent: 110,
      rotateX: -35,
      transformOrigin: '50% 100%',
      duration: duration.scrollReveal,
      stagger: 0.06,
    }).from(
      fades,
      {
        autoAlpha: 0,
        y: travel.scrollY,
        duration: duration.sequenceMax,
        stagger: stagger.min,
      },
      '-=0.5',
    );
  }

  return {
    kill() {
      tl.kill();
      g.set([...words, ...fades], { clearProps: 'all' });
    },
  };
}

export interface LineDrawOptions {
  readonly reducedMotion?: boolean;
  /** Delay before drawing starts (seconds), to follow a headline. */
  readonly delay?: number;
}

/**
 * Diagram build: `[data-node]` elements settle in (scale ≤ 1.05 → 1), then every
 * `[data-draw]` SVG path draws its stroke, then `[data-pulse]` dots fade in.
 */
export function createLineDraw(root: Element, options: LineDrawOptions = {}): MotionHandle {
  const g = ensureGsapPlugins();
  const nodes = root.querySelectorAll('[data-node]');
  const paths = gsap.utils.toArray<SVGPathElement>(root.querySelectorAll('[data-draw]'));
  const pulses = root.querySelectorAll('[data-pulse]');
  const tl = g.timeline({ delay: options.delay ?? 0 });

  if (options.reducedMotion === true) {
    tl.from([...nodes, ...paths, ...pulses], { autoAlpha: 0, duration: duration.reduced });
  } else {
    for (const path of paths) {
      const length = path.getTotalLength();
      g.set(path, { strokeDasharray: length, strokeDashoffset: length });
    }
    tl.from(nodes, {
      autoAlpha: 0,
      scale: 0.92,
      duration: duration.sequenceMax,
      ease: gsapEase.power3Out,
      stagger: stagger.max,
    })
      .to(
        paths,
        {
          strokeDashoffset: 0,
          duration: duration.scrollReveal,
          ease: gsapEase.power3InOut,
          stagger: stagger.min,
        },
        '-=0.3',
      )
      .from(pulses, { autoAlpha: 0, duration: duration.componentMax, stagger: stagger.min }, '-=0.2');
  }

  return {
    kill() {
      tl.kill();
      g.set([...nodes, ...paths, ...pulses], { clearProps: 'all' });
    },
  };
}

export interface ScrubProgressOptions {
  readonly reducedMotion?: boolean;
  /** Class toggled on each `[data-step]` once the progress line reaches it. */
  readonly activeClass: string;
}

/**
 * Intentional scroll-linked moment (DESIGN.md §7 allows rare scrub): a vertical rule fills
 * as the reader moves through `[data-step]` items, and each step lights up when reached.
 * Reduced motion: no scrub; every step is shown active and the rule is full.
 */
export function createScrubProgress(
  root: Element,
  fill: Element,
  options: ScrubProgressOptions,
): MotionHandle {
  const g = ensureGsapPlugins();
  const steps = gsap.utils.toArray<Element>(root.querySelectorAll('[data-step]'));
  const triggers: ScrollTrigger[] = [];

  if (options.reducedMotion === true) {
    g.set(fill, { scaleY: 1 });
    for (const step of steps) step.classList.add(options.activeClass);
    return {
      kill() {
        g.set(fill, { clearProps: 'all' });
      },
    };
  }

  const tween = g.fromTo(
    fill,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      transformOrigin: '50% 0%',
      scrollTrigger: {
        trigger: root,
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: 0.6,
      },
    },
  );
  if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);

  for (const step of steps) {
    triggers.push(
      ScrollTrigger.create({
        trigger: step,
        start: 'top 65%',
        onEnter: () => step.classList.add(options.activeClass),
        onLeaveBack: () => step.classList.remove(options.activeClass),
      }),
    );
  }

  return {
    kill() {
      tween.kill();
      for (const st of triggers) st.kill();
      for (const step of steps) step.classList.remove(options.activeClass);
      g.set(fill, { clearProps: 'all' });
    },
  };
}
