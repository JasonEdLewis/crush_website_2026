import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { FAITH_PACKAGES } from '@/lib/content';

export default function FaithPackages() {
  return (
    <div className="mx-auto max-w-8xl">
      <div className="grid lg:grid-cols-12 gap-10 mb-14">
        <div className="lg:col-span-5">
          <p className="h-eyebrow mb-10">Church media packages</p>
          <h2 className="font-display font-semibold text-display-2 tracking-tightest">
            Three packages. <span className="text-ink-400">One mission.</span>
          </h2>
        </div>
        <div className="lg:col-span-7 lg:pt-10">
          <p className="text-lg text-ink-300 leading-snug max-w-xl">
            From a single signature event to a documentary series that takes a
            pastor national — every package is built around a content engine,
            not a one-off film.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:gap-7 md:grid-cols-2 lg:grid-cols-3">
        {FAITH_PACKAGES.map((p, i) => (
          <Reveal
            key={p.slug}
            delay={i * 90}
            className={
              'flex flex-col rounded-2xl border bg-ink-950/40 p-7 md:p-8 transition-colors ' +
              (p.featured
                ? 'border-crush-500/60 ring-1 ring-crush-500/30 lg:-translate-y-2'
                : 'border-white/10 hover:border-white/20')
            }
          >
            <span
              className={
                'inline-flex w-fit items-center text-[11px] font-medium uppercase tracking-[0.08em] rounded-full px-3 py-1 ' +
                (p.featured
                  ? 'bg-crush-500/15 text-crush-500 border border-crush-500/30'
                  : 'bg-white/[0.04] text-ink-300 border border-white/10')
              }
            >
              {p.tier}
            </span>

            <h3 className="mt-5 font-display font-semibold text-2xl md:text-3xl tracking-tightest leading-[1.05]">
              {p.title}
            </h3>
            <p className="mt-3 text-ink-400 text-[0.95rem] leading-relaxed">
              {p.blurb}
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-3xl md:text-4xl tracking-tightest text-ink-50">
                {p.price}
              </span>
              <span className="text-xs text-ink-500">{p.cadence}</span>
            </div>

            <div className="mt-6 h-px w-full bg-white/5" aria-hidden />

            {p.sections.map((s) => (
              <div key={s.label} className="mt-6">
                <p className="h-eyebrow mb-3">{s.label}</p>
                <ul className="space-y-2.5">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm text-ink-300 leading-snug"
                    >
                      <span
                        aria-hidden
                        className={
                          'mt-[7px] inline-block h-1 w-1 rounded-full shrink-0 ' +
                          (p.featured ? 'bg-crush-500' : 'bg-ink-400')
                        }
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <Link
              href={`/faith/inquire/${p.slug}/`}
              className={
                'mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors ' +
                (p.featured
                  ? 'bg-crush-500 text-ink-950 hover:bg-crush-400'
                  : 'border border-white/15 text-ink-100 hover:bg-white/[0.04] hover:border-white/30')
              }
            >
              {p.ctaLabel} →
            </Link>
          </Reveal>
        ))}
      </div>

      <p className="mt-10 text-sm text-ink-500 max-w-2xl">
        Packages are starting points — every engagement is scoped to your
        congregation, cadence, and goals. Reach out and we&rsquo;ll come back
        with a tailored read.
      </p>
    </div>
  );
}
