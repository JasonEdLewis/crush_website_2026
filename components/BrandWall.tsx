'use client';

import Link from 'next/link';
import type { Brand } from '@/lib/content';

type Props = {
  brands: Brand[];
  className?: string;
  /** Currently-hovered brand. When set, every other tile fades out. */
  activeBrand?: Brand | null;
  /** Called whenever a brand tile is hovered/focused (cleared on mouse leave). */
  onActiveChange?: (brand: Brand | null) => void;
};

/**
 * Auto-scrolling brand strip.
 *
 * Logos render natively (no grayscale/opacity tint). Hover state is
 * forwarded to the parent via `onActiveChange` so an enclosing section can
 * react — e.g. swap its own background to the hovered brand's video.
 *
 * Active state is cleared on `onMouseLeave` of the strip wrapper (not each
 * tile), so moving between adjacent tiles updates without an off/on flicker.
 */
export default function BrandWall({
  brands,
  className = '',
  activeBrand,
  onActiveChange,
}: Props) {
  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      aria-label="Brands we've worked with"
      onMouseLeave={() => onActiveChange?.(null)}
    >
      {/* edge fade masks — hide the loop seam. They use the section's flat
          ink-950 color, so they read as dark "shadow" bands when a brand
          video takes over the section background. Fade them out while a
          brand is active. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-28 bg-gradient-to-r from-ink-950 to-transparent transition-opacity duration-500 ${activeBrand ? 'opacity-0' : 'opacity-100'}`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-28 bg-gradient-to-l from-ink-950 to-transparent transition-opacity duration-500 ${activeBrand ? 'opacity-0' : 'opacity-100'}`}
      />

      <ul className="marquee-track items-stretch gap-3 md:gap-4 py-1 [&:hover]:[animation-play-state:paused]">
        <Tiles brands={brands} activeBrand={activeBrand} onHover={onActiveChange} />
        <Tiles brands={brands} activeBrand={activeBrand} ariaHidden onHover={onActiveChange} />
      </ul>
    </div>
  );
}

/* ----------------------------- track contents ----------------------------- */

function Tiles({
  brands,
  activeBrand,
  ariaHidden = false,
  onHover,
}: {
  brands: Brand[];
  activeBrand?: Brand | null;
  ariaHidden?: boolean;
  onHover?: (brand: Brand | null) => void;
}) {
  const hasActive = !!activeBrand;
  return (
    <>
      {brands.map((b, i) => (
        <li
          key={`${b.name}-${i}`}
          className="shrink-0 h-28 md:h-36 w-[200px] sm:w-[220px] md:w-[260px]"
          aria-hidden={ariaHidden || undefined}
        >
          <BrandTile
            brand={b}
            onHover={onHover}
            dimmed={hasActive}
          />
        </li>
      ))}
      <li
        className="shrink-0 h-28 md:h-36 w-[200px] sm:w-[220px] md:w-[260px]"
        aria-hidden={ariaHidden || undefined}
      >
        <CTATile dimmed={hasActive} />
      </li>
    </>
  );
}

/* --------------------------------- tiles --------------------------------- */

function BrandTile({
  brand,
  onHover,
  dimmed = false,
}: {
  brand: Brand;
  onHover?: (b: Brand | null) => void;
  dimmed?: boolean;
}) {
  return (
    <div
      className={`group relative flex h-full items-center justify-center px-3 transition-opacity duration-300 ${dimmed ? 'opacity-0' : 'opacity-100'}`}
      onMouseEnter={() => brand.vimeoId && onHover?.(brand)}
      onFocus={() => brand.vimeoId && onHover?.(brand)}
    >
      {brand.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.logo}
          alt={brand.name}
          draggable={false}
          className="h-16 md:h-24 w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <span
          className="
            text-center font-display font-bold uppercase
            text-base md:text-lg leading-[1.05] tracking-tight
            text-ink-200 transition-colors duration-500
            group-hover:text-ink-50
          "
        >
          {brand.name}
        </span>
      )}
    </div>
  );
}

function CTATile({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <Link
      href="/contact/"
      className={`group flex h-full items-center justify-center px-3 transition-opacity duration-300 ${dimmed ? 'opacity-0' : 'opacity-100'}`}
    >
      <span
        className="
          text-center font-display font-bold uppercase
          text-base md:text-lg leading-[1.05] tracking-tight
          text-ink-300 transition-colors duration-500
          group-hover:text-crush-500
        "
      >
        Your brand here <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
