'use client';

import { useEffect, useState } from 'react';

/**
 * Tiny "Scroll" cue centered at the bottom of the hero. Fades out as soon
 * as the user starts scrolling so it doesn't compete with the revealed
 * hero text.
 */
export default function ScrollHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => setVisible(window.scrollY < 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-ink-50/70 transition-opacity duration-700 ease-out-quint"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <span className="inline-block h-px w-10 bg-ink-50/40" />
      Scroll
      <span className="inline-block h-px w-10 bg-ink-50/40" />
    </div>
  );
}
