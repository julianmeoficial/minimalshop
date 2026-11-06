import type { Transition, Variants } from 'motion/react';

import { duration, easeOutQuart, travel } from './easings';

/** KORVAE component enter: 8px rise, 340ms, ease-out-quart. */
const enterTransition: Transition = {
  duration: duration.enter,
  ease: easeOutQuart,
};

/** Fade + slight rise for component entrances (Motion). */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: travel.enterY },
  visible: {
    opacity: 1,
    y: 0,
    transition: enterTransition,
  },
};

/** Instant static state when prefers-reduced-motion is on. */
export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.reduced },
  },
};
