/**
 * Tracks the currently audible video card.
 *
 * Used by `VimeoEmbed` instances running in `localAudio` mode (per-card mute
 * controls, e.g. on the Work page) so unmuting one card automatically mutes
 * the others — avoids overlapping audio when several videos are on screen.
 */

let activeId: string | null = null;
const subscribers = new Set<(id: string | null) => void>();

export function setActiveAudio(id: string | null) {
  if (activeId === id) return;
  activeId = id;
  subscribers.forEach((fn) => fn(activeId));
}

export function subscribeActiveAudio(fn: (id: string | null) => void) {
  subscribers.add(fn);
  fn(activeId);
  return () => {
    subscribers.delete(fn);
  };
}
