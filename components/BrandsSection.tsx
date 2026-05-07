'use client';

import { useEffect, useState } from 'react';
import Reveal from './Reveal';
import SplitText from './SplitText';
import VimeoEmbed from './VimeoEmbed';
import BrandWall from './BrandWall';
import { setHeroPaused } from '@/lib/heroPause';
import type { Brand } from '@/lib/content';

/**
 * Credibility section: header copy, the brand marquee, and a footer line.
 *
 * When a brand tile in the marquee is hovered (and the brand has a
 * `vimeoId`), this component swaps the section's background to that brand's
 * video — full-bleed behind all of the section content. A dark scrim sits
 * over the video so the headline + body copy stay legible. Hover state is
 * fed in from `BrandWall` via its `onActiveChange` callback.
 */
export default function BrandsSection({ brands }: { brands: Brand[] }) {
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
  const showVideo = !!activeBrand?.vimeoId;

  // Tell the homepage hero reel to pause whenever a brand video takes over.
  useEffect(() => {
    setHeroPaused(showVideo);
    return () => setHeroPaused(false);
  }, [showVideo]);

  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-ink-950 py-20 md:py-28">
      {/* hover-revealed background video (desktop-only — hover state never
          fires on touch, so the iframe is never mounted on mobile). */}
      <div
        aria-hidden
        className={`
          pointer-events-none absolute inset-0 z-0
          transition-opacity duration-500 ease-out
          ${showVideo ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {showVideo ? (
          <VimeoEmbed
            key={activeBrand!.vimeoId}
            videoId={activeBrand!.vimeoId!}
            title={`${activeBrand!.name} preview`}
            fill
            lazy={false}
          />
        ) : null}
        {/* dark scrim — keeps text legible over the video */}
        <div className="absolute inset-0 bg-ink-950/65" />
      </div>

      {/* ambient glow — fades out when the video is up */}
      <div
        aria-hidden
        className={`
          absolute -top-32 left-1/2 h-[28rem] w-[60rem] -translate-x-1/2
          rounded-full bg-crush-500/[0.08] blur-[140px]
          transition-opacity duration-500
          ${showVideo ? 'opacity-0' : 'opacity-100'}
        `}
      />

      <div className="relative mx-auto max-w-8xl px-6 lg:px-10">
        {/* header */}
        <div className="mb-12 md:mb-16">
          <p className="h-eyebrow mb-10 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-ink-400" aria-hidden />
            Selected Partners
          </p>
          <h2 className="font-display font-bold uppercase tracking-tight text-display-2 text-ink-50">
            <SplitText className="block">Brands.Trust.</SplitText>
            <SplitText className="block text-ink-400" delay={250}>
              and their story.
            </SplitText>
          </h2>
        </div>

        {/* brand grid */}
        <Reveal>
          <BrandWall
            brands={brands}
            activeBrand={activeBrand}
            onActiveChange={setActiveBrand}
          />
        </Reveal>

      </div>
    </section>
  );
}
