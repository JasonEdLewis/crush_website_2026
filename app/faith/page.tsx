import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import Parallax from '@/components/Parallax';
import VimeoEmbed from '@/components/VimeoEmbed';
import FaithOfferings from '@/components/FaithOfferings';

export const metadata: Metadata = {
  title: 'Faith-Based Production — Crushfilms',
  description:
    'Story-led production for ministries and Christian-based businesses. Retainers, seminars, and faith-driven series — built for churches that take their message seriously.',
};

const OFFERINGS = [
  {
    number: '01',
    title: 'Ministry Retainers',
    blurb:
      'A standing production partner for megachurches and growing ministries. We handle the weekly cadence — sermon cuts, promo films, social reels — so your team stays on message without burning out the in-house crew.',
    capabilities: [
      'Sermon edits & series trailers',
      'Event & conference promos',
      'Vertical reels & shorts',
      'Donor & vision films',
      'Multi-cam capture',
    ],
  },
  {
    number: '02',
    title: 'Story-Led Seminars',
    blurb:
      'A working session for church communications teams. Half teaching, half hands-on — we walk through how brand, narrative, and craft actually move people, then build a story framework you can run with after we leave.',
    capabilities: [
      'Brand voice & narrative',
      'Visual identity audit',
      'Content system design',
      'Team workshop format',
      'On-site or virtual',
    ],
  },
  {
    number: '03',
    title: 'Faith-Based Series',
    blurb:
      'Original interview and documentary series produced for YouTube and long-form platforms. We develop, shoot, edit, and structure for distribution — built so brand partners, donors, and merch can carry the cost.',
    capabilities: [
      'Documentary & interview',
      'Series development',
      'Distribution strategy',
      'Sponsor & partner decks',
      'Episodic post pipeline',
    ],
  },
];

const PRINCIPLES = [
  {
    head: 'Reverence, not rehearsal.',
    body: 'We treat the message with the weight it deserves. No cheap tricks, no hollow polish — craft that carries the meaning.',
  },
  {
    head: 'A pace your team can hold.',
    body: 'Retainers are designed around a real weekly rhythm — Sunday service through Thursday post — so the work ships without grinding the staff down.',
  },
  {
    head: 'Built to multiply.',
    body: 'One Sunday becomes a sermon cut, three reels, a trailer, and a donor moment. We plan the system, not the one-off.',
  },
  {
    head: 'Honest scope.',
    body: 'If a retainer is the wrong call, we say so. The goal is your reach, not our invoice.',
  },
];

export default function FaithPage() {
  return (
    <>
      {/* page header */}
      <section className="relative overflow-hidden noise pt-32 md:pt-40 pb-16 border-b border-white/5">
        {/* full-bleed background video */}
        <VimeoEmbed
          videoId="1130023662"
          title="Faith-Based Production reel"
          fill
          lazy={false}
          className="z-0"
        />
        {/* darkening + brand wash so the headline stays readable */}
        <div className="absolute inset-0 z-10 bg-ink-950/70" aria-hidden />
        <div
          className="absolute inset-0 z-10 bg-gradient-to-b from-ink-950/80 via-ink-950/40 to-ink-950"
          aria-hidden
        />
        <div className="grid-bg absolute inset-0 z-10 opacity-30" aria-hidden />
        <div
          className="absolute -top-40 -right-40 z-10 h-[36rem] w-[36rem] rounded-full bg-crush-500/20 blur-[160px]"
          aria-hidden
        />
        <div className="relative z-20 mx-auto max-w-8xl px-6 lg:px-10">
          <Reveal>
            <p className="h-eyebrow mb-8 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-ink-400" />
              Faith-Based Production
            </p>
          </Reveal>
          <Parallax speed={-0.1}>
            <h1 className="font-display font-semibold text-display-1 tracking-tightest max-w-5xl">
              <SplitText immediate delay={120} stagger={75}>The message</SplitText>{' '}
              <SplitText immediate delay={400} stagger={75} className="text-ink-400">
                deserves
              </SplitText>{' '}
              <SplitText immediate delay={680} stagger={75}>the craft.</SplitText>
            </h1>
          </Parallax>
          <Reveal delay={260}>
            <p className="mt-10 max-w-2xl text-lg text-ink-300 leading-snug">
              A production arm built for ministries, megachurches, and
              Christian-based businesses. Retainers for the weekly cadence,
              seminars for your team, and original series for the long arc.
            </p>
          </Reveal>
        </div>
      </section>

      {/* offerings */}
      <section className="px-6 lg:px-10 py-12 md:py-20">
        <FaithOfferings offerings={OFFERINGS} />
      </section>

      {/* principles */}
      <section className="border-t border-white/5 bg-ink-950 px-6 lg:px-10 py-24 md:py-32">
        <div className="mx-auto max-w-8xl">
          <div className="grid lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-5">
              <p className="h-eyebrow mb-10">How we work with churches</p>
              <h2 className="font-display font-semibold text-display-2 tracking-tightest">
                A partner, not a&nbsp;vendor.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:pt-10">
              <p className="text-lg text-ink-300 leading-snug max-w-xl">
                We embed with your communications team — sit in on planning,
                share rough cuts mid-week, ship with intent. The work compounds
                because the relationship does.
              </p>
            </div>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <Reveal
                key={p.head}
                delay={i * 80}
                as="li"
                className="border-t border-white/5 lg:border-l lg:[&:first-child]:border-l-0 p-8 lg:p-10"
              >
                <span className="font-display text-sm text-crush-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-display text-xl md:text-2xl tracking-tighter">
                  {p.head}
                </h3>
                <p className="mt-3 text-ink-400 text-sm leading-relaxed">{p.body}</p>
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
              Pastoring a vision?{' '}
              <span className="text-ink-400">Tell us about it.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 text-ink-300 max-w-xl mx-auto">
              A sentence about your church, your audience, and what you&rsquo;re
              trying to build is enough. We&rsquo;ll come back with a scope, a
              cadence, and an honest read on fit.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact/" className="btn btn-primary">
                Start the conversation →
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
