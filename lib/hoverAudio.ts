/**
 * Tracks which hover-driven preview video is currently "active" — the row
 * being hovered on desktop, or the row crossing the mid-line on mobile.
 *
 * Used to coordinate audio across multiple background videos on the same
 * page. A page-level background video (e.g. the /faith hero) subscribes
 * and mutes itself whenever any card claims this slot, so the hovered
 * card's audio plays alone instead of fighting the hero.
 *
 * This is intentionally separate from `lib/activeAudio.ts`, which tracks
 * the per-card mute-button mode used on /work. Different interactions,
 * different coordination scopes.
 */

let activeId: string | null = null;
const subscribers = new Set<(id: string | null) => void>();

export function setHoverActive(id: string | null) {
  if (activeId === id) return;
  activeId = id;
  subscribers.forEach((fn) => fn(activeId));
}

export function getHoverActive() {
  return activeId;
}

export function subscribeHoverActive(fn: (id: string | null) => void) {
  subscribers.add(fn);
  fn(activeId);
  return () => {
    subscribers.delete(fn);
  };
}
