'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

export type Offering = {
  number: string;
  title: string;
  blurb: string;
  capabilities: string[];
};

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
      {/* md+ : existing editorial rows */}
      <div className="hidden md:block mx-auto max-w-8xl divide-y divide-white/5 border-y border-white/5">
        {offerings.map((o, i) => (
          <Reveal
            key={o.number}
            delay={i * 60}
            className="group grid grid-cols-12 gap-6 md:gap-10 py-10 md:py-14 hover:bg-white/[0.02] transition-colors px-2 md:px-4"
          >
            <div className="col-span-12 md:col-span-1 font-display text-sm text-ink-500">
              {o.number}
            </div>

            <div className="col-span-12 md:col-span-5">
              <h2 className="font-display font-semibold text-3xl md:text-5xl tracking-tightest leading-[1.0] group-hover:text-crush-500 transition-colors duration-700">
                {o.title}
              </h2>
            </div>

            <div className="col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-7 md:pt-2">
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
            </div>

            <div className="hidden lg:flex col-span-1 items-start justify-end pt-3">
              <Link
                href="/contact/"
                aria-label={`Inquire about ${o.title}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-all duration-500 group-hover:bg-ink-50 group-hover:text-ink-950 group-hover:rotate-[-45deg]"
              >
                →
              </Link>
            </div>
          </Reveal>
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
