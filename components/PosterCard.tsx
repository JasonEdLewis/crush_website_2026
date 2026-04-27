import VimeoEmbed from './VimeoEmbed';
import type { CaseStudy } from '@/lib/content';

type Props = {
  item: CaseStudy;
  size?: 'lg' | 'md';
  /**
   * When true and a `vimeoId` is set, renders an autoplay Vimeo embed.
   * When false, renders the gradient/initials poster (no external link).
   */
  embed?: boolean;
};

/**
 * Case-study card. Renders a real autoplay Vimeo embed when `embed` is true
 * and the project has a `vimeoId`; otherwise renders a gradient placeholder.
 *
 * No external "Watch on Vimeo" links or overlays — videos play in place.
 */
export default function PosterCard({ item, size = 'md', embed = false }: Props) {
  const aspect = size === 'lg' ? 'aspect-cinema' : 'aspect-still';

  if (embed && item.vimeoId) {
    return (
      <article>
        <VimeoEmbed
          videoId={item.vimeoId}
          title={`${item.client} — ${item.title}`}
          aspect={size === 'lg' ? 'aspect-cinema' : 'aspect-video'}
        />
        <Meta item={item} />
      </article>
    );
  }

  // Placeholder mode — no Vimeo external link, just a visual card.
  return (
    <article>
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/5 bg-ink-800 ${aspect}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-90`} />
        <div className="noise absolute inset-0" />

        {/* sprocket strips */}
        <div className="absolute inset-x-0 top-0 flex h-3 items-center gap-2 bg-ink-950/40 px-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="h-1.5 w-3 rounded-sm bg-ink-50/60" />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex h-3 items-center gap-2 bg-ink-950/40 px-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="h-1.5 w-3 rounded-sm bg-ink-50/60" />
          ))}
        </div>

        {/* big initials */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-bold text-[28vw] md:text-[16vw] lg:text-[10rem] tracking-tightest text-ink-950/30 mix-blend-overlay select-none">
            {item.initials}
          </span>
        </div>

        {/* meta tags */}
        <div className="absolute left-4 bottom-5 right-4 flex items-end justify-between text-xs text-ink-50">
          <span className="rounded-full bg-ink-950/60 backdrop-blur px-3 py-1">
            {item.category}
          </span>
          <span className="rounded-full bg-ink-950/60 backdrop-blur px-3 py-1">
            {item.year}
          </span>
        </div>
      </div>
      <Meta item={item} />
    </article>
  );
}

function Meta({ item }: { item: CaseStudy }) {
  return (
    <div className="mt-4">
      <p className="font-display text-lg md:text-xl tracking-tighter text-ink-50">
        {item.title}
      </p>
      <p className="text-sm text-ink-400 mt-1">
        {item.client} · {item.category} · {item.year}
      </p>
    </div>
  );
}
