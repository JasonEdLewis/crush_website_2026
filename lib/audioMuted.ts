/**
 * Site-wide audio mute state.
 *
 * All `VimeoEmbed` instances subscribe and post `setMuted` to their iframes
 * via the Vimeo Player API whenever this flips. The `AudioToggle` button in
 * the root layout is the only thing that flips it (a real user click is
 * required so browser autoplay policy lets us unmute).
 *
 * Default: muted. Site loads silent; the user opts in.
 */

let muted = true;
const subscribers = new Set<(muted: boolean) => void>();

export function setAudioMuted(value: boolean) {
  if (muted === value) return;
  muted = value;
  subscribers.forEach((fn) => fn(muted));
}

export function getAudioMuted() {
  return muted;
}

export function subscribeAudioMuted(fn: (muted: boolean) => void) {
  subscribers.add(fn);
  fn(muted);
  return () => {
    subscribers.delete(fn);
  };
}
