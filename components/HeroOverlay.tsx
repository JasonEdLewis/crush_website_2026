'use client';

import { useEffect, useState, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** scrollY threshold (px) at which the overlay reveals. */
  threshold?: number;
  className?: string;
};

/**
 * Hero text overlay that stays HIDDEN at the top of the page and reveals
 * once the user starts scrolling. Bidirectional: scroll back to the top
 * and the overlay disappears again.
 *
 * Behavior:
 * - Children are NOT mounted while inactive — so SplitText's word-by-word
 *   reveal starts fresh each time the user scrolls down past the threshold.
 * - Wrapper slides up from translateY(80px) → 0 with a 1.1s cubic-bezier
 *   ease, so the text appears to rise from the very bottom of the hero.
 * - Honors prefers-reduced-motion: stays visible always.
 */
export default function HeroOverlay({
  children,
  threshold = 60,
  className = '',
}: Props) {
  const [active, setActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduceMotion(reduce);
    if (reduce) {
      setActive(true);
      return;
    }

    const onScroll = () => {
      // bidirectional: shown while scrolled past threshold, hidden at top
      setActive(window.scrollY > threshold);
    };

    onScroll(); // covers reload-while-scrolled
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const isActive = reduceMotion || active;

  return (
    <div
      className={className}
      style={{
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'translateY(0)' : 'translateY(80px)',
        transition: reduceMotion
          ? 'none'
          : 'opacity 1100ms cubic-bezier(0.22, 1, 0.36, 1), transform 1100ms cubic-bezier(0.22, 1, 0.36, 1)',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
      aria-hidden={!isActive}
    >
      {isActive ? children : null}
    </div>
  );
}
