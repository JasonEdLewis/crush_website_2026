import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import PosterCard from '@/components/PosterCard';
import SplitText from '@/components/SplitText';
import Parallax from '@/components/Parallax';
import { WORK } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Work — Crush Films',
  description:
    'Selected commercial, brand, and documentary work from Crush Films / Merrick Robert Media.',
};

export default function WorkPage() {
  return (
    <>
      {/* page header */}
      <section className="relative overflow-hidden noise pt-32 md:pt-40 pb-16 border-b border-white/5">
        <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-8xl px-6 lg:px-10">
          <Reveal>
            <p className="h-eyebrow mb-8 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-ink-400" />
              Selected Work
            </p>
          </Reveal>
          <Parallax speed={-0.1}>
            <h1 className="font-display font-semibold text-display-1 tracking-tightest max-w-5xl">
              <SplitText immediate delay={120} stagger={75}>Films built to</SplitText>{' '}
              <SplitText immediate delay={350} stagger={75} className="text-ink-400">
                earn attention,
              </SplitText>{' '}
              <SplitText immediate delay={650} stagger={75}>not buy it.</SplitText>
            </h1>
          </Parallax>
          <Reveal delay={260}>
            <p className="mt-10 max-w-2xl text-lg text-ink-300 leading-snug">
              A rolling selection of recent commercial, brand, and short-film
              work. Every film plays in place — scroll on through.
            </p>
          </Reveal>
        </div>
      </section>

      {/* full work grid — every project is a real Vimeo embed */}
      <section className="px-6 lg:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-8xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {WORK.map((item, i) => (
            <Reveal
              key={item.slug}
              delay={(i % 2) * 120}
              className="scroll-mt-32"
            >
              <div id={item.slug}>
                <PosterCard item={item} size={i === 0 ? 'lg' : 'md'} embed />
              </div>
              <p className="mt-3 text-sm text-ink-400 max-w-md">{item.blurb}</p>
            </Reveal>
          ))}
        </div>
      </section>
     
    </>
  );
}
