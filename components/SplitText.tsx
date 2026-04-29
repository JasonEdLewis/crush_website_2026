'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  /** The text to split & animate. */
  children: string;
  /** Outer wrapper className (e.g. font/size classes). */
  className?: string;
  /** Stagger between words, in ms. */
  stagger?: number;
  /** Initial transition delay, in ms. */
  delay?: number;
  /** Duration per word, in ms. */
  duration?: number;
  /** Render this as a heading element if you want — defaults to span. */
  as?: keyof JSX.IntrinsicElements;
  /** Trigger immediately on mount instead of when scrolled into view. */
  immediate?: boolean;
};

/**
 * Word-by-word reveal. Each word lives inside an overflow-hidden mask;
 * a child span translates from translateY(110%) -> 0 with a per-word
 * stagger. The result is the "rising lines of text" effect Kode-style
 * sites use on their headlines.
 *
 * - Triggered when the element first enters viewport (or immediately if
 *   `immediate` is true).
 * - Respects prefers-reduced-motion via globals.css `.reveal` rule fallback
 *   plus an explicit no-op below.
 */
export default function SplitText({
  children,
  className = '',
  stagger = 70,
  delay = 0,
  duration = 900,
  as = 'span',
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(immediate);

  // honour prefers-reduced-motion
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (immediate || shown) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [immediate, shown]);

  // Split on whitespace, preserve original spacing visually with margin.
  const words = children.split(/(\s+)/);

  const Tag = as as any;

  return (
    <Tag
      ref={ref as any}
      className={`split-text inline-block ${className}`}
      aria-label={children}
    >
      {words.map((word, i) => {
        if (/^\s+$/.test(word)) {
          // preserve a real space between word masks
          return <span key={i} aria-hidden> </span>;
        }

        const wordIndex = words
          .slice(0, i)
          .filter((w) => !/^\s+$/.test(w)).length;

        const transform = reduceMotion || shown ? 'translateY(0)' : 'translateY(110%)';
        const opacity = reduceMotion || shown ? 1 : 0;
        const transitionDelay = `${delay + wordIndex * stagger}ms`;

        return (
          <span
            key={i}
            aria-hidden
            className="inline-block overflow-hidden"
            // `vertical-align: bottom` keeps the mask's bottom on the line-box
            // bottom (predictable) instead of falling into the
            // overflow-hidden+baseline trap, where the box's baseline becomes
            // its bottom margin edge and the text drifts up into elements
            // above. Padding gives ascender/descender room so glyphs aren't
            // clipped at tight display line-heights; the matching negative
            // margin keeps the layout box flush with the visible text so
            // adjacent sections don't shift.
            style={{
              verticalAlign: 'bottom',
              paddingTop: '0.12em',
              paddingBottom: '0.18em',
              marginTop: '-0.12em',
              marginBottom: '-0.18em',
              lineHeight: 1,
            }}
          >
            <span
              className="inline-block will-change-transform"
              style={{
                transform,
                opacity,
                transition: reduceMotion
                  ? 'none'
                  : `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${transitionDelay}, opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${transitionDelay}`,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
