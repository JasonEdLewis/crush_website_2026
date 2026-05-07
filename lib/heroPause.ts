/**
 * Tiny pub/sub for "should the homepage hero video pause right now?".
 *
 * Used to coordinate between the hero (which renders the reel as a full-bleed
 * background video) and the Selected Partners section (which plays a brand
 * video on hover). The hero subscribes; the brand section pushes.
 *
 * Module-level state is fine here — there's only ever one hero and one
 * brand section per page, and both live under the same client subtree.
 */

let paused = false;
const subscribers = new Set<(paused: boolean) => void>();

export function setHeroPaused(value: boolean) {
  if (paused === value) return;
  paused = value;
  subscribers.forEach((fn) => fn(paused));
}

export function subscribeHeroPaused(fn: (paused: boolean) => void) {
  subscribers.add(fn);
  fn(paused);
  return () => {
    subscribers.delete(fn);
  };
}
