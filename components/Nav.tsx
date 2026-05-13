'use client';

import Link from 'next/link';
import { useState } from 'react';
import { NAV } from '@/lib/content';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
    >
      <div className="mx-auto max-w-8xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Merrick Robert Media / Crushfilms — home"
        >
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-crush-500 transition-transform duration-700 ease-out-quint group-hover:rotate-180">
            <span className="absolute inset-1 rounded-full bg-ink-900" />
          </span>
          <span className="font-display font-semibold text-[1.05rem] tracking-tighter">
            merrick robert media / crushfilms
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-300 hover:text-ink-50 transition-colors duration-300"
            >
              <span className="link-underline">{item.label}</span>
            </Link>
          ))}
          <Link
            href="/contact/"
            className="group inline-flex items-center gap-1.5 text-sm text-crush-500 hover:text-crush-400 transition-colors duration-300"
          >
            <span className="link-underline">Start a project</span>
            <span
              aria-hidden
              className="inline-block transition-transform duration-500 ease-out-quint group-hover:translate-x-1"
            >
            </span>
          </Link>
        </nav>

        {/* mobile toggle */}
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-3 w-5">
            <span
              className={[
                'absolute left-0 top-0 h-px w-full bg-ink-50 transition-transform duration-500',
                open ? 'translate-y-[6px] rotate-45' : '',
              ].join(' ')}
            />
            <span
              className={[
                'absolute left-0 bottom-0 h-px w-full bg-ink-50 transition-transform duration-500',
                open ? '-translate-y-[6px] -rotate-45' : '',
              ].join(' ')}
            />
          </span>
        </button>
      </div>

      {/* mobile sheet */}
      <div
        className={[
          'md:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-out-quint border-b border-white/5',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <nav className="px-6 py-6 flex flex-col gap-5 bg-ink-900/95 backdrop-blur-xl">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-2xl tracking-tighter text-ink-50"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact/"
            onClick={() => setOpen(false)}
            className="group inline-flex items-center gap-2 self-start mt-2 font-display text-2xl tracking-tighter text-crush-500 hover:text-crush-400 transition-colors duration-300"
          >
            <span className="link-underline">Start a project</span>
            <span
              aria-hidden
              className="inline-block transition-transform duration-500 ease-out-quint group-hover:translate-x-1"
            >
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
