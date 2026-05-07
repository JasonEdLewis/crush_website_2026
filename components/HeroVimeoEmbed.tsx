'use client';

import { useEffect, useState } from 'react';
import VimeoEmbed from './VimeoEmbed';
import { subscribeHeroPaused } from '@/lib/heroPause';

type Props = {
  videoId: string;
  title?: string;
};

/**
 * Hero showreel — same VimeoEmbed (fill, eager-mount) as before, but with
 * `paused` driven by the `heroPause` pub/sub. The Selected Partners section
 * pushes `true` when a brand video is playing so the hero stops competing
 * for attention; the iframe stays mounted so playback resumes in place.
 */
export default function HeroVimeoEmbed({ videoId, title }: Props) {
  const [paused, setPaused] = useState(false);

  useEffect(() => subscribeHeroPaused(setPaused), []);

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
