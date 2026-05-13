'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { subscribeAudioMuted } from '@/lib/audioMuted';
import { setActiveAudio, subscribeActiveAudio } from '@/lib/activeAudio';

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
  /**
   * When true, sends a Vimeo Player API `pause` message to the iframe. When
   * flipped back to false, sends `play`. The iframe stays mounted, so
   * playback resumes from where it was.
   */
  paused?: boolean;
  /**
   * When true, the embed manages its own mute state via a button overlay
   * instead of subscribing to the site-wide AudioToggle. Unmuting one card
   * automatically mutes any other `localAudio` embed currently playing
   * (single-active-audio coordination via `lib/activeAudio`).
   */
  localAudio?: boolean;
  /**
   * Explicit mute override. When defined, takes precedence over both the
   * site-wide AudioToggle and `localAudio` subscriptions — the parent owns
   * mute state (e.g. hover-to-unmute on the services page).
   */
  muted?: boolean;
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
  paused = false,
  localAudio = false,
  muted,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [mounted, setMounted] = useState(!lazy);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [localMuted, setLocalMuted] = useState(true);
  // Stable per-instance id so multiple embeds with the same videoId still
  // coordinate correctly via `activeAudio`.
  const instanceId = useId();

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

  // Vimeo Player API: post `pause`/`play` to the iframe when `paused` flips.
  useEffect(() => {
    if (!iframeLoaded) return;
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(
      JSON.stringify({ method: paused ? 'pause' : 'play' }),
      '*',
    );
  }, [paused, iframeLoaded]);

  const hasMutedOverride = muted !== undefined;

  // Parent-controlled mute override (e.g. hover-to-unmute on services page).
  useEffect(() => {
    if (!iframeLoaded || !hasMutedOverride) return;
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(
      JSON.stringify({ method: 'setMuted', value: muted }),
      '*',
    );
  }, [iframeLoaded, hasMutedOverride, muted]);

  // Site-wide mute subscription (only in shared-audio mode).
  // The initial subscribe call fires immediately with the current value, so
  // the iframe gets the right state as soon as it has loaded.
  useEffect(() => {
    if (!iframeLoaded || localAudio || hasMutedOverride) return;
    return subscribeAudioMuted((m) => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      win.postMessage(
        JSON.stringify({ method: 'setMuted', value: m }),
        '*',
      );
    });
  }, [iframeLoaded, localAudio, hasMutedOverride]);

  // Local mute mode: another card claiming audio mutes this one.
  useEffect(() => {
    if (!localAudio || hasMutedOverride) return;
    return subscribeActiveAudio((id) => {
      if (id !== instanceId) setLocalMuted(true);
    });
  }, [localAudio, instanceId, hasMutedOverride]);

  // Local mute mode: push current mute state to the iframe.
  useEffect(() => {
    if (!iframeLoaded || !localAudio || hasMutedOverride) return;
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(
      JSON.stringify({ method: 'setMuted', value: localMuted }),
      '*',
    );
  }, [localAudio, localMuted, iframeLoaded, hasMutedOverride]);

  // Autoplay-loop-muted pattern with chrome hidden. Note: we deliberately
  // do NOT use `background=1` here — that forces mute and ignores the
  // Player API's `setMuted` calls. Building the equivalent param-by-param
  // keeps the same chrome-hidden look while letting AudioToggle unmute.
  const src =
    `https://player.vimeo.com/video/${videoId}` +
    `?autoplay=1&muted=1&loop=1&autopause=0` +
    `&title=0&byline=0&portrait=0&controls=0&dnt=1&playsinline=1`;

  // Fill (cover) mode: scale iframe up so 16:9 video covers a container of
  // any aspect ratio, like CSS `object-fit: cover`.
  // Width = max(100%, 177.78vh)  ·  Height = max(100%, 56.25vw)
  const fillIframe =
    'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ' +
    'h-[max(100%,_56.25vw)] w-[max(100%,_177.78vh)] min-h-full min-w-full border-0 pointer-events-none';

  const handleLocalToggle = () => {
    setLocalMuted((prev) => {
      const next = !prev;
      // Unmuting → claim the active audio slot. Muting → release if held.
      if (!next) setActiveAudio(instanceId);
      else setActiveAudio(null);
      return next;
    });
  };

  const audioButton = localAudio ? (
    <button
      type="button"
      onClick={handleLocalToggle}
      aria-label={localMuted ? 'Unmute video' : 'Mute video'}
      aria-pressed={!localMuted}
      className="
        absolute bottom-3 right-3 z-10
        inline-flex h-9 w-9 items-center justify-center
        rounded-full border border-white/15 bg-ink-950/70
        backdrop-blur-md text-ink-100
        transition-colors duration-300
        hover:bg-ink-950/90 hover:text-ink-50 hover:border-crush-500/60
        focus:outline-none focus-visible:ring-2 focus-visible:ring-crush-500
      "
    >
      {localMuted ? <MutedIcon /> : <UnmutedIcon />}
    </button>
  ) : null;

  if (fill) {
    return (
      <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
        {mounted ? (
          <iframe
            ref={iframeRef}
            src={src}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className={fillIframe}
            onLoad={() => setIframeLoaded(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-900 to-black" />
        )}
        {audioButton}
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
          ref={iframeRef}
          src={src}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
          onLoad={() => setIframeLoaded(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-900 to-black" />
      )}
      {audioButton}
    </div>
  );
}

function MutedIcon() {
  return (
    <svg
      width="16"
      height="16"
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
      width="16"
      height="16"
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
