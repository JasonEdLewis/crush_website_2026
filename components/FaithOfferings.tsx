'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import VimeoEmbed from '@/components/VimeoEmbed';
import { subscribeAudioMuted } from '@/lib/audioMuted';
import { setHoverActive } from '@/lib/hoverAudio';

export type Offering = {
  number: string;
  title: string;
  blurb: string;
  capabilities: string[];
  vimeoId?: string;
};

/* ---------------------------------------------------------------------------
 * Mobile coordination — on (hover: none) devices, the row whose card overlaps
 * the viewport mid-line is the "active" one. Mirrors VideoServiceRow so the
 * faith offerings page feels the same as /services.
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

/** Scroll to the packages section at the bottom of /faith. Falls back to a
 *  jump if the target is missing (shouldn't happen — the section owns the id). */
function scrollToPackages() {
  if (typeof document === 'undefined') return;
  const target = document.getElementById('packages');
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

export default function FaithOfferings({ offerings }: { offerings: Offering[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex !== null ? offerings[openIndex] : null;

  // Lock body scroll + Esc-to-close while the sheet is open.
  useEffect(() => {
    if (open === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {/* md+ : editorial rows; rows with a vimeoId reveal a Vimeo background on hover */}
      <div className="hidden md:block mx-auto max-w-8xl divide-y divide-white/5 border-y border-white/5">
        {offerings.map((o, i) => (
          <OfferingRow key={o.number} offering={o} index={i} />
        ))}
      </div>

      {/* below md : compact list — tap a row to open a sheet */}
      <ul className="md:hidden mx-auto max-w-8xl divide-y divide-white/5 border-y border-white/5">
        {offerings.map((o, i) => (
          <li key={o.number}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-haspopup="dialog"
              aria-expanded={openIndex === i}
              className="group w-full flex items-center gap-5 py-7 px-2 text-left transition-colors hover:bg-white/[0.02] focus:outline-none focus-visible:bg-white/[0.03]"
            >
              <span className="font-display text-xs text-ink-500 w-6 shrink-0">
                {o.number}
              </span>
              <h2 className="flex-1 font-display font-semibold text-2xl tracking-tightest leading-[1.05] group-hover:text-crush-500 transition-colors">
                {o.title}
              </h2>
              <span
                aria-hidden
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-all group-hover:bg-ink-50 group-hover:text-ink-950"
              >
                +
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* bottom-sheet style dialog (mobile only) */}
      {open && openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="faith-offering-title"
          className="md:hidden fixed inset-0 z-[100] flex items-end"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpenIndex(null)}
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm animate-[fadeUp_0.3s_ease-out]"
          />
          <div
            className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-white/10 bg-ink-900 px-6 pt-6 pb-10 animate-fade-up"
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/15" aria-hidden />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-xs text-ink-500">{open.number}</p>
                <h3
                  id="faith-offering-title"
                  className="mt-2 font-display font-semibold text-3xl tracking-tightest leading-[1.05] text-ink-50"
                >
                  {open.title}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpenIndex(null)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-ink-300 hover:bg-ink-50 hover:text-ink-950 transition"
              >
                ×
              </button>
            </div>

            {open.vimeoId && (
              <div className="mt-6">
                <VimeoEmbed
                  videoId={open.vimeoId}
                  title={`${open.title} — preview`}
                  lazy={false}
                  localAudio
                />
              </div>
            )}

            <p className="mt-6 text-ink-300 text-[1.02rem] leading-relaxed">
              {open.blurb}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {open.capabilities.map((c) => (
                <li
                  key={c}
                  className="text-xs text-ink-400 border border-white/10 rounded-full px-3 py-1"
                >
                  {c}
                </li>
              ))}
            </ul>

            <Link
              href="/contact/"
              onClick={() => setOpenIndex(null)}
              className="btn btn-primary mt-8 w-full justify-center"
            >
              Inquire about {open.title} →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Editorial row for an offering. Mirrors the visual contract of the original
 * text rows, and — when `vimeoId` is set — reveals a Vimeo background on
 * hover (desktop) or when the row crosses the mid-line (mobile / no-hover),
 * matching the VideoServiceRow pattern on /services.
 */
function OfferingRow({ offering: o, index: i }: { offering: Offering; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [siteMuted, setSiteMuted] = useState(true);

  // Site-wide AudioToggle is the master gate — hover only unmutes if the
  // global toggle is also unmuted. Mirrors VideoServiceRow on /services.
  useEffect(() => subscribeAudioMuted(setSiteMuted), []);

  // Claim the hover-active audio slot whenever this row owns the spotlight,
  // so page-level background videos (e.g. the /faith hero) can mute. Skip
  // when there's no video on the row.
  useEffect(() => {
    if (!o.vimeoId) return;
    if (hovered || active) {
      setHoverActive(o.number);
      return () => setHoverActive(null);
    }
  }, [hovered, active, o.number, o.vimeoId]);

  useEffect(() => {
    if (!o.vimeoId) return;
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: none)').matches) return;

    const id = o.number;
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
  }, [o.number, o.vimeoId]);

  const hasVideo = Boolean(o.vimeoId);

  return (
    <Reveal delay={i * 60}>
      <div
        ref={ref}
        data-active={active || undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative overflow-hidden hover:bg-white/[0.02] transition-colors px-2 md:px-4"
      >
        {/* video + gradient — revealed on hover / active */}
        {hasVideo && (
          <div
            className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 group-data-[active]:opacity-100 transition-opacity duration-700 pointer-events-none"
            aria-hidden
          >
            <VimeoEmbed
              videoId={o.vimeoId!}
              title={`${o.title} — preview`}
              fill
              muted={siteMuted || !(hovered || active)}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-ink-950/20 to-transparent" />
            <div className="noise absolute inset-0" />
          </div>
        )}

        {/* default content — fades out on hover/active when there is a video */}
        <div
          className={
            'relative z-10 grid grid-cols-12 gap-6 md:gap-10 py-10 md:py-14 transition-opacity duration-500 ' +
            (hasVideo
              ? 'group-hover:opacity-0 group-data-[active]:opacity-0'
              : '')
          }
        >
          <div className="col-span-12 md:col-span-1 font-display text-sm text-ink-500">
            {o.number}
          </div>

          <div className="col-span-12 md:col-span-5">
            <h2 className="font-display font-semibold text-3xl md:text-5xl tracking-tightest leading-[1.0] group-hover:text-crush-500 transition-colors duration-700">
              {o.title}
            </h2>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-6 lg:col-start-7 md:pt-2">
            <p className="text-ink-300 text-[1.05rem] leading-relaxed">{o.blurb}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {o.capabilities.map((c) => (
                <li
                  key={c}
                  className="text-xs text-ink-400 border border-white/10 rounded-full px-3 py-1"
                >
                  {c}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={scrollToPackages}
              aria-label={`See packages and pricing for ${o.title}`}
              className="mt-7 group/cta inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.02] px-5 py-2.5 text-sm font-medium text-ink-100 transition-all duration-500 hover:bg-crush-500 hover:text-ink-950 hover:border-crush-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-crush-500"
            >
              <span>See packages &amp; pricing</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 group-hover/cta:translate-x-1"
              >
                →
              </span>
            </button>
          </div>
        </div>

        {/* hover/active panel — frosted column with title + blurb (md+) */}
        {hasVideo && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-stretch opacity-0 group-hover:opacity-100 group-data-[active]:opacity-100 transition-opacity duration-500">
            <div className="flex flex-col py-9 px-5 md:py-12 md:px-7 md:w-1/3 md:max-w-[33%] md:bg-ink-950/[0.025] md:backdrop-blur-2xl">
              <span className="hidden md:block font-display text-xs text-ink-300 mb-3">
                {o.number}
              </span>
              <h2 className="hidden md:block font-display font-semibold text-2xl md:text-3xl tracking-tightest leading-[1.05] text-crush-500 mb-4">
                {o.title}
              </h2>
              <p className="hidden md:block text-sm md:text-[15px] text-ink-100 leading-snug">
                {o.blurb}
              </p>

              <button
                type="button"
                onClick={scrollToPackages}
                aria-label={`See packages and pricing for ${o.title}`}
                className="pointer-events-auto mt-6 group/cta hidden md:inline-flex w-fit items-center gap-2.5 rounded-full bg-crush-500 px-5 py-2.5 text-sm font-medium text-ink-950 transition-all duration-500 hover:bg-crush-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-50"
              >
                <span>See packages &amp; pricing</span>
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-500 group-hover/cta:translate-x-1"
                >
                  →
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
}
