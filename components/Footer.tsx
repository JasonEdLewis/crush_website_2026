import Link from 'next/link';
import { NAV, SITE } from '@/lib/content';
import SocialIcon, { type SocialKey } from './SocialIcon';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-ink-950">
      <div className="px-6 lg:px-10 py-8 md:py-16">
        {/* On mobile: only the social icons row.
            On md+: the full link grid (Studio / Sitemap / Contact / Follow). */}
        <div className="mx-auto max-w-8xl grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="hidden md:block">
            <p className="h-eyebrow mb-4">Studio</p>
            <p className="text-ink-50">{SITE.name}</p>
            <p className="text-ink-400 text-sm mt-1">{SITE.studio.line1}</p>
            <p className="text-ink-400 text-sm">{SITE.studio.line2}</p>
          </div>
          <div className="hidden md:block">
            <p className="h-eyebrow mb-4">Sitemap</p>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-ink-200 hover:text-ink-50 transition">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:block">
            <p className="h-eyebrow mb-4">Contact</p>
            <a href={`mailto:${SITE.email}`} className="block text-ink-200 hover:text-ink-50 transition">
              {SITE.email}
            </a>
            {SITE.phone ? (
              <a
                href={`tel:${SITE.phone}`}
                className="block text-ink-400 text-sm mt-1 hover:text-ink-50 transition"
              >
                {SITE.phone}
              </a>
            ) : null}
          </div>
          <div>
            <p className="hidden md:block h-eyebrow mb-4">Follow</p>
            <ul className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {SITE.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="
                      group inline-flex h-10 w-10 items-center justify-center
                      rounded-full border border-white/10 text-ink-300
                      transition-all duration-500 ease-out-quint
                      hover:border-crush-500 hover:text-crush-500 hover:-translate-y-0.5
                    "
                  >
                    <SocialIcon name={s.icon as SocialKey} className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright + tagline — desktop only */}
        <div className="hidden md:flex mx-auto max-w-8xl mt-16 pt-8 border-t border-white/5 flex-wrap items-center justify-between gap-4 text-xs text-ink-500">
          <p>© {year} {SITE.legalName}. All rights reserved.</p>
          <p>Built lean. Hosted static.</p>
        </div>
      </div>
    </footer>
  );
}
