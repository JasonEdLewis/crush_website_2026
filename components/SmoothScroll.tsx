'use client';

import { useEffect } from 'react';

/**
 * Mounts Lenis to give the page that smooth, glide-y scroll feel that
 * production-studio sites (Kode, Active Theory, Resn, etc.) use.
 *
 * - Native-mode Lenis: it just smooths the wheel; window.scrollY still
 *   reflects the eased position, so any other scroll-bound component
 *   (Parallax, IntersectionObserver, etc.) keeps working.
 * - Respects prefers-reduced-motion: we just no-op there.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;

    let lenis: import('lenis').default | null = null;
    let frame = 0;
    let cancelled = false;

    (async () => {
      const { default: Lenis } = await import('lenis');
      if (cancelled) return;

      lenis = new Lenis({
        // The signature easing curve used in this category of sites.
        // Slightly longer duration + snappy ease-out feels closest to
        // Kode / Active Theory.
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);

  return null;
}
