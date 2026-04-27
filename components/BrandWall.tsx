import Link from 'next/link';
import type { Brand } from '@/lib/content';

type Props = {
  brands: Brand[];
  className?: string;
};

/**
 * Credibility-focused brand grid (replaces the earlier marquee).
 *
 * - Uniform aspect-ratio tiles in a responsive grid (2 → 3 → 4 cols).
 * - Each tile carries the brand name + an optional location chip.
 * - Logos can be dropped in per-brand via the `logo` field on Brand.
 * - The final tile is a "Your brand here →" CTA that links to /contact/.
 * - Hover state lights up the tile borders + reveals a crush-red accent
 *   so the wall feels alive without being noisy.
 */
export default function BrandWall({ brands, className = '' }: Props) {
  return (
    <ul
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 ${className}`}
      aria-label="Brands we've worked with"
    >
      {brands.map((b) => (
        <li key={b.name}>
          <BrandTile brand={b} />
        </li>
      ))}
      <li>
        <CTATile />
      </li>
    </ul>
  );
}

/* ----------------------------- tiles ----------------------------- */

function BrandTile({ brand }: { brand: Brand }) {
  return (
    <div
      className="
        group relative aspect-[3/2] overflow-hidden rounded-xl
        border border-white/5 bg-ink-900/60 backdrop-blur-sm
        transition-all duration-500 ease-out-quint
        hover:border-white/20 hover:bg-white/[0.03]
      "
    >
      {/* hover accent — soft crush glow from corner */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-br from-crush-500/0 via-transparent to-crush-500/0
          opacity-0 transition-opacity duration-700
          group-hover:opacity-100 group-hover:from-crush-500/15 group-hover:to-transparent
        "
      />

      {/* location chip top-right */}
      {brand.location ? (
        <span
          className="
            absolute right-3 top-3 z-10
            rounded-full border border-white/10 px-2 py-0.5
            text-[9px] uppercase tracking-[0.2em]
            text-ink-400 transition-colors duration-500
            group-hover:border-crush-500/60 group-hover:text-crush-500
          "
        >
          {brand.location}
        </span>
      ) : null}

      {/* brand mark — image if provided, wordmark fallback otherwise */}
      <div className="relative flex h-full items-center justify-center px-5 py-6">
        {brand.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logo}
            alt={brand.name}
            draggable={false}
            className="
              h-10 md:h-12 w-auto max-w-full object-contain
              opacity-75 grayscale transition-all duration-500
              group-hover:opacity-100 group-hover:grayscale-0
            "
          />
        ) : (
          <span
            className="
              text-center font-display font-bold
              text-[15px] md:text-base lg:text-lg
              leading-[1.05] tracking-tight uppercase
              text-ink-200 transition-colors duration-500
              group-hover:text-ink-50
            "
          >
            {brand.name}
          </span>
        )}
      </div>

      {/* bottom hairline that draws in on hover */}
      <span
        aria-hidden
        className="
          pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left
          scale-x-0 bg-crush-500 transition-transform duration-700 ease-out-quint
          group-hover:scale-x-100
        "
      />
    </div>
  );
}

function CTATile() {
  return (
    <Link
      href="/contact/"
      className="
        group relative flex aspect-[3/2] items-center justify-center
        overflow-hidden rounded-xl border border-dashed border-white/15
        bg-transparent transition-all duration-500 ease-out-quint
        hover:border-solid hover:border-crush-500 hover:bg-crush-500
      "
    >
      <span
        className="
          relative z-10 text-center font-display font-bold uppercase
          text-[15px] md:text-base lg:text-lg leading-[1.05] tracking-tight
          text-ink-300 transition-colors duration-500
          group-hover:text-ink-950
        "
      >
        Your brand
        <br />
        here <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
