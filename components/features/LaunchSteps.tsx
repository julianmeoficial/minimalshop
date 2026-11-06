'use client';

import { useEffect, useRef } from 'react';

import { LAUNCH_STEPS } from '@/lib/content/funcionamiento';
import { createScrubProgress } from '@/lib/motion';

import styles from './LaunchSteps.module.css';

/** Five steps from the open API to a live store; the rule fills as you read (GSAP scrub). */
export function LaunchSteps() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const fill = fillRef.current;
    if (!root || !fill) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const handle = createScrubProgress(root, fill, {
      reducedMotion: reduced,
      activeClass: styles.active ?? 'active',
    });
    return () => handle.kill();
  }, []);

  return (
    <div ref={rootRef} className={styles.wrap}>
      <span className={styles.track} aria-hidden="true">
        <span ref={fillRef} className={styles.fill} />
      </span>
      <ol className={styles.list}>
      {LAUNCH_STEPS.map((step, i) => (
        <li key={step.title} className={styles.step} data-step>
          <span className={styles.dot} aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className={styles.content}>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.body}>{step.body}</p>
            {step.code ? <code className={styles.code}>{step.code}</code> : null}
          </div>
        </li>
      ))}
      </ol>
    </div>
  );
}
