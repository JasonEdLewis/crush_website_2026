'use client';

import { useEffect, useState } from 'react';
import {
  getAudioMuted,
  setAudioMuted,
  subscribeAudioMuted,
} from '@/lib/audioMuted';

/**
 * Floating audio mute toggle.
 *
 * Sits fixed bottom-right and drives the site-wide audio state in
 * `lib/audioMuted`. All `VimeoEmbed` instances subscribe to that state and
 * forward it to their iframes via the Vimeo Player API.
 *
 * Default state is muted; clicking is the user gesture browsers require to
 * unmute autoplaying videos.
 */
export default function AudioToggle() {
  const [muted, setMuted] = useState(getAudioMuted());

  useEffect(() => subscribeAudioMuted(setMuted), []);

  return (
    <button
      type="button"
      onClick={() => setAudioMuted(!muted)}
      aria-label={muted ? 'Unmute video audio' : 'Mute video audio'}
      aria-pressed={!muted}
      className="
        fixed bottom-5 right-5 z-50
        inline-flex h-11 w-11 items-center justify-center
        rounded-full border border-white/15 bg-ink-950/70
        backdrop-blur-md text-ink-100
        transition-colors duration-300
        hover:bg-ink-950/90 hover:text-ink-50 hover:border-crush-500/60
        focus:outline-none focus-visible:ring-2 focus-visible:ring-crush-500
      "
    >
      {muted ? <MutedIcon /> : <UnmutedIcon />}
    </button>
  );
}

function MutedIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}

function UnmutedIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
