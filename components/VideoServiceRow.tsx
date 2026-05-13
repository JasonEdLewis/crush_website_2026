'use client';

import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import VimeoEmbed from './VimeoEmbed';
import { subscribeAudioMuted } from '@/lib/audioMuted';
import { setHoverActive } from '@/lib/hoverAudio';
import type { Service } from '@/lib/content';

/* ---------------------------------------------------------------------------
 * Mobile coordination (module-level, one instance across all video rows).
 *
 * On `(hover: none)` devices we want exactly one video to be "active" at a
 * time — the one whose card overlaps the viewport's vertical mid-line. A
 * shared rAF-throttled scroll handler computes the winner and pushes it to
 * subscribers; each VideoServiceRow renders an active state only when its
 * own id matches.
 * ------------------------------------------------------------------------- */

const registered = new Map<string, HTMLElement>();
const subscribers = new Set<(activeId: string | null) => void>();
let activeId: string | null = null;
let scrollHandlerInstalled = false;

function recompute() {
  if (typeof window === 'undefined') return;
  const center = window.innerHeight / 2;
  let next: string | null = null;
  registered.forEach((el, id) => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= center && rect.bottom >= center) next = id;
  });
  if (next === activeId) return;
  activeId = next;
  subscribers.forEach((fn) => fn(activeId));
}

function installScrollHandler() {
  if (scrollHandlerInstalled) return;
  if (typeof window === 'undefined') return;
  if (!window.matchMedia('(hover: none)').matches) return;
  scrollHandlerInstalled = true;
  let raf = 0;
  const onScroll = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(recompute);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  recompute();
}

/* ------------------------------------------------------------------------- */

/**
 * Service row with a Vimeo preview that reveals on hover (desktop) or when
 * the card crosses the 50% viewport mark (mobile / no-hover). On mobile
 * exactly one row is active at a time — coordinated by the module-level
 * helpers above.
 */
export default function VideoServiceRow({
  service: s,
  index: i,
}: {
  service: Service;
  index: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [siteMuted, setSiteMuted] = useState(true);

  // Site-wide AudioToggle is the master gate — hover only unmutes if the
  // global toggle is also unmuted.
  useEffect(() => subscribeAudioMuted(setSiteMuted), []);

  // Claim the hover-active audio slot whenever this row owns the spotlight,
  // so page-level background videos can mute themselves.
  useEffect(() => {
    if (hovered || active) {
      setHoverActive(s.number);
      return () => setHoverActive(null);
    }
  }, [hovered, active, s.number]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: none)').matches) return;

    const id = s.number;
    registered.set(id, el);
    installScrollHandler();

    const handler = (currentId: string | null) => setActive(currentId === id);
    subscribers.add(handler);
    handler(activeId);
    recompute();

    return () => {
      subscribers.delete(handler);
      registered.delete(id);
      recompute();
    };
  }, [s.number]);

  return (
    <Reveal delay={i * 60}>
      <div
        ref={ref}
        data-active={active || undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative overflow-hidden hover:bg-white/[0.02] transition-colors px-2 md:px-4"
      >
        {/* media + gradient — revealed on hover/active.
            Image takes precedence over video when both are set. */}
        <div
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 group-data-[active]:opacity-100 transition-opacity duration-700 pointer-events-none"
          aria-hidden
        >
          {s.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.imageSrc}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <VimeoEmbed
              videoId={s.vimeoId!}
              title={`${s.title} — preview`}
              fill
              muted={siteMuted || !(hovered || active)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-ink-950/20 to-transparent" />
          <div className="noise absolute inset-0" />
        </div>

        {/* default content — matches TextServiceRow; fades out on hover/active */}
        <div className="relative z-10 grid grid-cols-12 gap-6 md:gap-10 py-10 md:py-14 transition-opacity duration-500 group-hover:opacity-0 group-data-[active]:opacity-0">
          <div className="col-span-12 md:col-span-6">
            <h2 className="font-display font-semibold text-3xl md:text-5xl tracking-tightest leading-[1.0] group-hover:text-crush-500 group-data-[active]:text-crush-500 transition-colors duration-700">
              {s.title}
            </h2>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-7 md:pt-2">
            <p className="text-ink-300 text-[1.05rem] leading-relaxed">{s.blurb}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {s.capabilities.map((c) => (
                <li
                  key={c}
                  className="text-xs text-ink-400 border border-white/10 rounded-full px-3 py-1"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* hover/active panel.
            Mobile: panel has no frost, no width cap, and no content — the
            active state on mobile shows just the video.
            Desktop (md+): ≤20% frost column with title + blurb (no pills). */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-stretch opacity-0 group-hover:opacity-100 group-data-[active]:opacity-100 transition-opacity duration-500">
          <div className="flex flex-col py-9 px-5 md:py-12 md:px-7 md:w-1/5 md:max-w-[20%] md:bg-ink-950/[0.025] md:backdrop-blur-2xl">
            <h2 className="hidden md:block font-display font-semibold text-xl md:text-2xl tracking-tightest leading-[1.05] text-crush-500 mb-4">
              {s.title}
            </h2>
            <p className="hidden md:block text-sm md:text-[15px] text-ink-100 leading-snug">
              {s.blurb}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
