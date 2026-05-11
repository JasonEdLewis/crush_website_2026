import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import Parallax from '@/components/Parallax';
import VideoServiceRow from '@/components/VideoServiceRow';
import { SERVICES, APPROACH, type Service } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Services — Merrick Robert Media / Crushfilms',
  description:
    'Commercial production, brand films, documentary, content systems, post-production, and live capture.',
};

export default function ServicesPage() {
  return (
    <>
      {/* page header */}
      <section className="relative overflow-hidden noise pt-32 md:pt-40 pb-16 border-b border-white/5">
        <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
        <div
          className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-crush-500/25 blur-[160px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-8xl px-6 lg:px-10">
          <Reveal>
            <p className="h-eyebrow mb-8 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-ink-400" />
              Capabilities
            </p>
          </Reveal>
          <Parallax speed={-0.1}>
            <h1 className="font-display font-semibold text-display-1 tracking-tightest max-w-5xl">
              <SplitText immediate delay={120} stagger={75}>One studio.</SplitText>{' '}
              <SplitText immediate delay={400} stagger={75} className="text-ink-400">
                Seven ways
              </SplitText>{' '}
              <SplitText immediate delay={620} stagger={75}>to ship.</SplitText>
            </h1>
          </Parallax>
          <Reveal delay={260}>
            <p className="mt-10 max-w-2xl text-lg text-ink-300 leading-snug">
              Pick a service or stitch them together. Most of our best work is
              two or three of these working as a system, not a one-off film.
            </p>
          </Reveal>
        </div>
      </section>

      {/* services list — editorial rows for text-only services,
          cinematic full-bleed cards for services with a vimeoId */}
      <section className="px-6 lg:px-10 py-12 md:py-20">
        <div className="mx-auto max-w-8xl divide-y divide-white/5 border-y border-white/5">
          {SERVICES.map((s, i) =>
            s.vimeoId ? (
              <VideoServiceRow key={s.number} service={s} index={i} />
            ) : (
              <TextServiceRow key={s.number} service={s} index={i} />
            ),
          )}
        </div>
      </section>

      {/* approach */}
      <section className="border-t border-white/5 bg-ink-950 px-6 lg:px-10 py-24 md:py-32">
        <div className="mx-auto max-w-8xl">
          <div className="grid lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-5">
              <p className="h-eyebrow mb-10">Process</p>
              <h2 className="font-display font-semibold text-display-2 tracking-tightest">
                A loop, not a&nbsp;ladder.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:pt-10">
              <p className="text-lg text-ink-300 leading-snug max-w-xl">
                We share work early and often. You see edits as they evolve,
                weigh in mid-stream, and we ship faster — with fewer surprises
                at the end.
              </p>
            </div>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((a, i) => (
              <Reveal
                key={a.step}
                delay={i * 80}
                as="li"
                className="border-t border-white/5 lg:border-l lg:[&:first-child]:border-l-0 p-8 lg:p-10"
              >
                <span className="font-display text-sm text-crush-500">{a.step}</span>
                <h3 className="mt-3 font-display text-xl md:text-2xl tracking-tighter">
                  {a.title}
                </h3>
                <p className="mt-3 text-ink-400 text-sm leading-relaxed">{a.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 px-6 lg:px-10 py-24 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <h2 className="font-display font-semibold text-display-2 tracking-tightest">
              Have a brief? <span className="text-ink-400">Send it our way.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 text-ink-300 max-w-xl mx-auto">
              Even a sentence is enough to start. We&rsquo;ll come back with a
              point of view, a scope, and an honest read on whether we&rsquo;re
              the right team.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact/" className="btn btn-primary">
                Start a project
              </Link>
              <Link href="/work/" className="btn btn-ghost">
                See the work
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ----------------------------- service rows ----------------------------- */

/**
 * Editorial row used for services WITHOUT a video.
 * Title on the left, blurb + capability pills on the right.
 */
function TextServiceRow({ service: s, index: i }: { service: Service; index: number }) {
  return (
    <Reveal
      delay={i * 60}
      className="group grid grid-cols-12 gap-6 md:gap-10 py-10 md:py-14 hover:bg-white/[0.02] transition-colors px-2 md:px-4"
    >
      <div className="col-span-12 md:col-span-6">
        <h2 className="font-display font-semibold text-3xl md:text-5xl tracking-tightest leading-[1.0] group-hover:text-crush-500 transition-colors duration-700">
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
    </Reveal>
  );
}

