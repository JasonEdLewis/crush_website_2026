'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  /** Numeric Vimeo video id (the digits in vimeo.com/<id>). */
  videoId: string;
  /** Optional title for accessibility. */
  title?: string;
  /** Tailwind aspect class. Defaults to 16:9. Ignored when `fill` is true. */
  aspect?: string;
  className?: string;
  /**
   * When true (default), the iframe only mounts once the section scrolls
   * into the viewport — keeps initial page weight low when there are
   * multiple embeds on a page.
   */
  lazy?: boolean;
  /**
   * When true, the iframe stretches to cover its parent container,
   * cropping as needed (object-cover semantics). Use for full-bleed
   * hero backgrounds — the parent must set its own height + position:relative.
   */
  fill?: boolean;
};

/**
 * Autoplay Vimeo embed (muted, looped, controls hidden) — the standard
 * "background hero video" pattern.
 *
 * Implementation notes:
 * - `background=1` hides Vimeo's chrome and forces muted autoplay-loop.
 * - `dnt=1` disables Vimeo's tracking cookies on the embed.
 * - We lazy-mount the iframe via IntersectionObserver so off-screen videos
 *   never start fetching until the user scrolls near them.
 */
export default function VimeoEmbed({
  videoId,
  title = 'Vimeo video',
  aspect = 'aspect-video',
  className = '',
  lazy = true,
  fill = false,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(!lazy);

  useEffect(() => {
    if (!lazy || mounted) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setMounted(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: '300px 0px' }, // start loading just before it scrolls in
    );

    io.observe(el);
    return () => io.disconnect();
  }, [lazy, mounted]);

  // Autoplay-loop-muted pattern with chrome hidden.
  const src =
    `https://player.vimeo.com/video/${videoId}` +
    `?background=1&autoplay=1&muted=1&loop=1&autopause=0` +
    `&title=0&byline=0&portrait=0&controls=0&dnt=1`;

  // Fill (cover) mode: scale iframe up so 16:9 video covers a container of
  // any aspect ratio, like CSS `object-fit: cover`.
  // Width = max(100%, 177.78vh)  ·  Height = max(100%, 56.25vw)
  const fillIframe =
    'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ' +
    'h-[max(100%,_56.25vw)] w-[max(100%,_177.78vh)] min-h-full min-w-full border-0 pointer-events-none';

  if (fill) {
    return (
      <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
        {mounted ? (
          <iframe
            src={src}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className={fillIframe}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-900 to-black" />
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative ${aspect} w-full overflow-hidden rounded-2xl bg-ink-900 ${className}`}
    >
      {mounted ? (
        <iframe
          src={src}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-900 to-black" />
      )}
    </div>
  );
}
