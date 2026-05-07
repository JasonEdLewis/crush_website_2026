import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import Parallax from '@/components/Parallax';
import { STUDIO_FACTS, SITE } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About — Crushfilms',
  description:
    'Crushfilms is a small, senior production studio building brand films from Merrick, NY.',
};

const TEAM = [
  {
    name: 'Merrick Ward',
    role: 'Founder · Director · DP',
    note: 'Cinematographer, director, and screenwriter. Builds films from the lens out — sharp scripts, small crews, real frames.',
  },
  {
    name: 'In-house Edit Bay',
    role: 'Edit · Color · Sound',
    note: 'Story-led post — color, sound design, and final mix all under one roof.',
  },
  {
    name: 'Senior Crew Network',
    role: 'Producers · DPs · Camera',
    note: 'Hand-picked per project. Senior-only. The people on set are the people who pitched.',
  },
];

const PRINCIPLES = [
  {
    head: 'Story before stunts.',
    body: 'A clear narrative spine before the camera roll. Camera tricks are bonus, not foundation.',
  },
  {
    head: 'Senior people, fewer of them.',
    body: 'Decisions made on set, not via group chat. Lean crews ship faster and waste less of your day.',
  },
  {
    head: 'Edit in public.',
    body: 'You see cuts as they evolve. Fewer surprises, sharper feedback, better final film.',
  },
  {
    head: 'Built for the channel.',
    body: 'Hero spots and 9:16 cut-downs treated with equal craft. Wherever your audience is, we cut for it.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* page header */}
      <section className="relative overflow-hidden noise pt-32 md:pt-40 pb-16 border-b border-white/5">
        <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-8xl px-6 lg:px-10">
          <Reveal>
            <p className="h-eyebrow mb-8 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-ink-400" />
              About the Studio
            </p>
          </Reveal>
          <Parallax speed={-0.1}>
            <h1 className="font-display font-semibold text-display-1 tracking-tightest max-w-6xl">
              <SplitText immediate delay={120} stagger={60}>
                We make films like a product team —
              </SplitText>{' '}
              <SplitText immediate delay={520} stagger={60} className="text-ink-400">
                tight loops, sharp delivery, no fluff.
              </SplitText>
            </h1>
          </Parallax>
        </div>
      </section>

      {/* story */}
      <section className="px-6 lg:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-8xl grid lg:grid-cols-12 gap-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <p className="h-eyebrow mb-10">Origin</p>
            <h2 className="font-display font-semibold text-display-3 tracking-tightest leading-[1.05]">
              Built in Atlanta. Shot wherever the&nbsp;story&nbsp;is.
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={120}>
            <div className="space-y-6 text-ink-300 text-[1.05rem] leading-relaxed">
              <p>
                {SITE.name} is a director-led production studio founded by
                Merrick Ward — a cinematographer and writer who started
                shooting because the films he wanted to watch weren&rsquo;t
                being made.
              </p>
              <p>
                Today the studio works with brands, nonprofits, artists, and
                operators who treat film as a serious channel — not a line
                item to check off the deck. Every brief gets the same first
                question: what does this film need to <em>do</em>?
              </p>
              <p>Then we make that.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* facts strip */}
      <section className="border-y border-white/5 bg-ink-950 px-6 lg:px-10 py-16">
        <div className="mx-auto max-w-8xl grid grid-cols-2 md:grid-cols-4 gap-8">
          {STUDIO_FACTS.map((f, i) => (
            <Reveal key={f.label} delay={i * 80}>
              <p className="font-display text-4xl md:text-6xl tracking-tightest text-ink-50">
                {f.value}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink-400">
                {f.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* team */}
      <section className="px-6 lg:px-10 py-24 md:py-32">
        <div className="mx-auto max-w-8xl">
          <div className="grid lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-5">
              <p className="h-eyebrow mb-10">Team</p>
              <h2 className="font-display font-semibold text-display-2 tracking-tightest">
                Small studio. <span className="text-ink-400">Senior bench.</span>
              </h2>
            </div>
            <div className="lg:col-span-7 lg:pt-10">
              <p className="text-lg text-ink-300 leading-snug max-w-xl">
                A core crew in the studio, plus a deep network of producers,
                DPs, and editors we cast per project. Every hire is senior —
                because every decision shows up on screen.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-y border-white/5">
            {TEAM.map((t, i) => (
              <Reveal
                key={t.name}
                delay={i * 100}
                className="md:[&:not(:first-child)]:border-l border-white/5 p-8 md:p-10"
              >
                <p className="font-display text-2xl md:text-3xl tracking-tighter">
                  {t.name}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-crush-500">
                  {t.role}
                </p>
                <p className="mt-5 text-ink-400 text-sm leading-relaxed">
                  {t.note}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* principles */}
      <section className="border-t border-white/5 bg-ink-950 px-6 lg:px-10 py-24 md:py-32">
        <div className="mx-auto max-w-8xl">
          <div className="grid lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-5">
              <p className="h-eyebrow mb-10">Principles</p>
              <h2 className="font-display font-semibold text-display-2 tracking-tightest">
                What we believe about&nbsp;film.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            {PRINCIPLES.map((p, i) => (
              <Reveal
                key={p.head}
                delay={i * 100}
                className="bg-ink-950 p-8 md:p-12"
              >
                <p className="font-display text-2xl md:text-3xl tracking-tighter">
                  {p.head}
                </p>
                <p className="mt-4 text-ink-400 leading-relaxed">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 px-6 lg:px-10 py-24 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <h2 className="font-display font-semibold text-display-2 tracking-tightest">
              Want to work together?
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact/" className="btn btn-primary">
                Start a project
              </Link>
              <Link href="/services/" className="btn btn-ghost">
                View our services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
