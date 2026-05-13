'use client';

import { useEffect, useState } from 'react';
import VimeoEmbed from './VimeoEmbed';
import { subscribeHeroPaused } from '@/lib/heroPause';
import { setAudioMuted, notifyAudioMuted } from '@/lib/audioMuted';

type Props = {
  videoId: string;
  title?: string;
};

/**
 * Hero showreel — same VimeoEmbed (fill, eager-mount) as before, but with
 * `paused` driven by the `heroPause` pub/sub. The Selected Partners section
 * pushes `true` when a brand video is playing so the hero stops competing
 * for attention; the iframe stays mounted so playback resumes in place.
 *
 * The hero also opts the site-wide audio state into "unmuted by default" on
 * mount. Browser autoplay policy will block the initial setMuted call until
 * the user has interacted with the page, so we also re-fire the current
 * audio state on the first pointerdown/keydown so the unmute can actually
 * engage.
 */
export default function HeroVimeoEmbed({ videoId, title }: Props) {
  const [paused, setPaused] = useState(false);

  useEffect(() => subscribeHeroPaused(setPaused), []);

  useEffect(() => {
    setAudioMuted(false);
    const retry = () => notifyAudioMuted();
    const opts = { once: true, capture: true } as const;
    window.addEventListener('pointerdown', retry, opts);
    window.addEventListener('keydown', retry, opts);
    return () => {
      window.removeEventListener('pointerdown', retry, opts);
      window.removeEventListener('keydown', retry, opts);
    };
  }, []);

  return (
    <VimeoEmbed
      videoId={videoId}
      title={title}
      fill
      lazy={false}
      paused={paused}
    />
  );
}
