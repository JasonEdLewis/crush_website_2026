'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /**
   * How fast the element moves relative to scroll.
   *  -0.2 = drifts up at 20% of scroll speed (text staying behind)
   *   0.2 = pushes down at 20% of scroll speed
   *   0.5 = strong parallax
   *   0   = no movement
   */
  speed?: number;
  /** Optional clamp on max translation in px (prevents drifting too far). */
  max?: number;
};

/**
 * Scroll-bound translateY. Reads window.scrollY (which Lenis updates)
 * relative to the element's position in the page, so the element starts
 * at its natural position and drifts as the viewport moves over it.
 *
 * Implementation:
 * - Anchor the element's "rest" scrollY at first paint (top of element
 *   relative to document).
 * - On scroll, compute distance from the rest point and translate by
 *   distance * speed.
 * - Use requestAnimationFrame to coalesce updates and avoid jank.
 */
export default function Parallax({
  children,
  className = '',
  speed = -0.15,
  max,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const restRef = useRef<number>(0);
  const tickingRef = useRef<boolean>(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      restRef.current = window.scrollY + el.getBoundingClientRect().top;
    };

    const apply = () => {
      tickingRef.current = false;
      // Anchor at rest: dy must be 0 when the element is at its natural
      // position. Adding window.innerHeight here (the previous behavior)
      // pre-shifted the element by innerHeight * speed on first paint —
      // for a hero at the top of the page that meant the H1 spawned ~80px
      // above its layout slot and overlapped the eyebrow above it.
      const dy = (window.scrollY - restRef.current) * speed;
      const clamped = max != null ? Math.max(-max, Math.min(max, dy)) : dy;
      el.style.transform = `translate3d(0, ${clamped.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(apply);
    };

    measure();
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, [speed, max, reduceMotion]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
