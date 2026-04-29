# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # local dev server on http://localhost:3000
npm run build   # static export → ./out/ (deploy artifact)
npm run lint    # next lint
npm start       # only useful for sanity-checking a server-rendered build; production deploy uses `out/`
```

There is no test suite.

## Static-export constraint (load-bearing)

`next.config.mjs` sets `output: 'export'`, `trailingSlash: true`, and `images: { unoptimized: true }`. The site is deployed by uploading the `out/` folder to Namecheap shared hosting (Apache, no Node runtime). This means:

- **No server features.** No API routes, no Server Actions, no `revalidate`/ISR, no middleware, no dynamic route params without `generateStaticParams`, no `next/image` optimization (use `unoptimized` if adding `<Image>`).
- **All internal links must include the trailing slash** (e.g. `/work/`, not `/work`) — see `lib/content.ts` `NAV` for the pattern. Apache resolves `folder/index.html` and the trailing slash keeps relative asset URLs correct.
- **Contact form uses `mailto:`** because there is no backend. If swapping in Formspree/Web3Forms, only the `<form action>` in `app/contact/page.tsx` changes.

## Architecture

Next.js 14 App Router + Tailwind. The interesting structure is small and intentional:

- **`lib/content.ts` is the single source of truth** for all site copy and data: `SITE`, `NAV`, `SERVICES`, `WORK` (case studies, with optional `vimeoId`), `BRANDS`/`CLIENTS`, `APPROACH`, `STUDIO_FACTS`. Page components import these constants — copy edits are a one-file change. `watchHrefFor()` centralizes the "vimeo URL with profile fallback" rule.
- **`app/layout.tsx`** wraps every route with `SmoothScroll` (Lenis), `Nav`, `Footer`. Fonts (Inter, Inter Tight) are loaded via Google Fonts `<link>` tags rather than `next/font` so the static export has zero build-time network dependencies.
- **`app/globals.css`** holds the design system primitives that aren't Tailwind utilities: `.btn`/`.btn-primary`/`.btn-ghost`, `.reveal`/`.is-in` (paired with `<Reveal>`), `.h-eyebrow`, `.link-underline`, `.noise`, `.grid-bg`, `.aspect-cinema`, `.marquee-track`. The `<noscript>` block in `layout.tsx` force-shows `.reveal` content if JS is disabled.
- **`tailwind.config.ts`** defines the brand tokens that are referenced everywhere: `ink-{50..950}` (dark grayscale) and `crush-{50..900}` (the `#ff3b1f` accent). Use these instead of raw hex / Tailwind defaults to keep the palette consistent.
- **`@/*` path alias** maps to repo root (see `tsconfig.json`). Imports look like `@/components/Nav`, `@/lib/content`.

### Motion / interactivity

The site is mostly server components. Client components are the motion/interactivity primitives below, plus `Nav.tsx` (mobile menu / scroll state). They're designed to be combined rather than extended:

- **`SmoothScroll.tsx`** — mounts Lenis once at the layout level. Native-mode (smooths the wheel; `window.scrollY` still reflects eased position so `IntersectionObserver`/parallax work). No-ops when `prefers-reduced-motion: reduce`.
- **`Reveal.tsx`** — `IntersectionObserver` adds `is-in` once per element, then disconnects. The actual transition is the `.reveal` CSS rule. Use `delay` for staggered groups.
- **`VimeoEmbed.tsx`** — iframe is lazy-mounted via `IntersectionObserver` (300px rootMargin) so multiple embeds on a page don't all fetch at once. `background=1&autoplay=1&muted=1&loop=1&controls=0` is the chrome-hidden autoplay pattern. `fill` mode covers the parent (parent must be `position: relative` with its own height); default mode renders inside an aspect-ratio'd rounded container.
- **`Parallax.tsx`** / **`SplitText.tsx`** / **`HeroOverlay.tsx`** / **`ScrollHint.tsx`** — small, single-purpose effects.

### Adding a new case study or service

Edit `lib/content.ts`. For case studies, `vimeoId` is the digits from `vimeo.com/<id>` and unlocks the real `<VimeoEmbed>` in `PosterCard` (when called with `embed`); without it, `PosterCard` renders the gradient + initials placeholder. Keep `accent` as a Tailwind gradient string (`from-... via-... to-...`) and `initials` to two letters.

### Adding real logos to the brand wall

Drop the file in `public/logos/<slug>.svg` (SVG preferred) and set `logo: '/logos/<slug>.svg'` on the `BRANDS` entry. `BrandWall` falls back to a typography wordmark when `logo` is unset.

## Deployment

`npm run build` → upload **the contents of** `out/` (not the folder itself) to `public_html/` via cPanel File Manager. The `_next/` directory must come along — that's all the CSS/JS/font assets. Optional `.htaccess` for cache headers and friendly 404 is documented in `README.md`.

A stale `out/out/` subdirectory may exist from prior sandbox builds; `rm -rf out` before rebuilding if you want a clean export.
