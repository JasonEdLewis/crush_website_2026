'use client';

import { useEffect, useState } from 'react';
import VimeoEmbed from '@/components/VimeoEmbed';
import { subscribeAudioMuted } from '@/lib/audioMuted';
import { subscribeHoverActive } from '@/lib/hoverAudio';

/**
 * Hero background video for /faith.
 *
 * Subscribes to two pieces of state:
 *  - site-wide AudioToggle (master gate)
 *  - the hover-active slot (which row is hovered / mid-line on mobile)
 *
 * Mutes whenever the site is globally muted OR a card is currently claiming
 * audio, so the hovered card's preview plays alone instead of competing with
 * the hero's audio.
 */
export default function FaithHero({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [siteMuted, setSiteMuted] = useState(true);
  const [hoverActiveId, setHoverActiveId] = useState<string | null>(null);

  useEffect(() => subscribeAudioMuted(setSiteMuted), []);
  useEffect(() => subscribeHoverActive(setHoverActiveId), []);

  const cardClaimingAudio = hoverActiveId !== null;
  const muted = siteMuted || cardClaimingAudio;

  return (
    <VimeoEmbed
      videoId={videoId}
      title={title}
      fill
      lazy={false}
      className="z-0"
      muted={muted}
    />
  );
}
