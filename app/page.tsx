import Link from 'next/link';
import Reveal from '@/components/Reveal';
import HeroVimeoEmbed from '@/components/HeroVimeoEmbed';
import SplitText from '@/components/SplitText';
import Parallax from '@/components/Parallax';
import HeroOverlay from '@/components/HeroOverlay';
import ScrollHint from '@/components/ScrollHint';
import BrandsSection from '@/components/BrandsSection';
import { SERVICES, WORK, BRANDS, APPROACH, SITE } from '@/lib/content';

export default function HomePage() {
  // Featured reel = first WORK item, used as the full-bleed hero video.
  const reel = WORK[0];

  return (
    <>
      {/* ============================================================
          HERO — full-bleed showreel with overlaid title
         ============================================================ */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        {/* video as background — pauses while a brand video is playing */}
        {reel.vimeoId ? (
          <HeroVimeoEmbed
            videoId={reel.vimeoId}
            title={`${reel.client} — ${reel.title}`}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-crush-500 via-rose-500 to-amber-400" />
        )}

        {/* readability overlays */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-transparent to-ink-950/85"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-ink-950/10 to-transparent"
          aria-hidden
        />
        <div className="noise absolute inset-0" aria-hidden />

        {/* hero text — eyebrow + headline only, pinned bottom-left third */}
        <HeroOverlay
          threshold={60}
          className="absolute inset-x-0 bottom-0 z-10 px-6 lg:px-10 pb-12 md:pb-16"
        >
          <Parallax speed={-0.12} className="mx-auto max-w-8xl">
            {/* 12-col grid puts the headline in the left third (col-span-4)
                on xl, growing slightly wider at smaller breakpoints to keep
                the type readable. */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-8 lg:col-span-5 xl:col-span-4">
                {/* Eyebrow — small enough to live on a single line */}
                <p className="mb-5 flex items-center gap-3 whitespace-nowrap text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-ink-50/70">
                  <span className="inline-block h-px w-6 shrink-0 bg-ink-50/50" aria-hidden />
                  <span className="truncate">
                    {SITE.name} — Production Studio · Atlanta, GA
                  </span>
                </p>

                {/* Headline — uppercase, bold, tight leading (matches screenshot) */}
                <h1 className="font-display font-bold uppercase tracking-tight text-display-2">
                  <SplitText
                    as="span"
                    className="block text-ink-50"
                    immediate
                    delay={120}
                    stagger={80}
                  >
                    Visuals for
                  </SplitText>
                  <SplitText
                    as="span"
                    className="block text-ink-50"
                    immediate
                    delay={360}
                    stagger={80}
                  >
                    the next level.
                  </SplitText>
                </h1>
              </div>
            </div>
          </Parallax>
        </HeroOverlay>

        {/* scroll cue (fades out as soon as scroll begins) */}
        <ScrollHint />
      </section>

      {/* ============================================================
          CREDIBILITY WALL — brand grid + framing
         ============================================================ */}
      <BrandsSection brands={BRANDS} />

      {/* ============================================================
          APPROACH — hidden on mobile (lives on /about/ + /services/)
         ============================================================ */}
      <section className="hidden md:block border-t border-white/5 px-6 lg:px-10 py-24 md:py-32">
        <div className="mx-auto max-w-8xl">
          <div className="grid lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-5">
              <p className="h-eyebrow mb-10">Approach</p>
              <h2 className="font-display font-semibold text-display-2 tracking-tightest">
                <SplitText stagger={70}>How we make films.</SplitText>
              </h2>
            </div>
            <div className="lg:col-span-7 lg:pt-10">
              <p className="text-lg text-ink-300 leading-snug max-w-xl">
                We treat every project like a product launch — clear brief,
                tight loop, sharp delivery. No magic; just craft, and a process
                that respects your time.
              </p>
            </div>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((a, i) => (
              <Reveal
                key={a.step}
                delay={i * 100}
                as="li"
                className="border-t border-white/5 lg:border-l lg:[&:first-child]:border-l-0 p-8 lg:p-10 relative"
              >
                <span className="font-display text-sm text-crush-500">{a.step}</span>
                <h3 className="mt-3 font-display text-xl md:text-2xl tracking-tighter">
                  {a.title}
                </h3>
                <p className="mt-3 text-ink-400 text-sm leading-relaxed">
                  {a.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================================================
          CLOSING CTA
         ============================================================ */}
      <section className="border-t border-white/5 px-6 lg:px-10 py-32 md:py-40 relative overflow-hidden">
        <div
          className="absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-crush-500/20 blur-[140px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-5xl text-center">
          <Reveal>
            <p className="h-eyebrow mb-8 justify-center">Let&rsquo;s make something</p>
          </Reveal>
          <h2 className="font-display font-semibold text-display-2 md:text-display-1 tracking-tightest">
            <SplitText stagger={80} className="block">
              Got a story
            </SplitText>{' '}
            <SplitText stagger={80} delay={300} className="block text-ink-400">
              worth telling?
            </SplitText>
          </h2>
          <Reveal delay={300}>
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
