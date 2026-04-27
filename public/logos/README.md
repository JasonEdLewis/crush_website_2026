# Brand logos

Drop real logo files here, then point each brand at it in `lib/content.ts`.

## Adding a logo

1. Save the file as `<slug>.svg` (preferred) or `<slug>.png` in this folder.
   - Use lowercase, hyphenated slugs: `hanes.svg`, `aarp.svg`, `palm-beach-lounge.svg`.
   - Prefer SVG. If only PNG exists, use a transparent background and at least 2x density (e.g., 480px tall).
   - Logos are rendered in grayscale by default and tint to full color on hover, so high-contrast monochrome SVGs look the cleanest.
2. Open `lib/content.ts` and set the `logo` field on the matching brand:

```ts
{ name: 'Hanes Brands', logo: '/logos/hanes.svg' },
```

3. Rebuild: `npm run build`. The wordmark fallback for that brand is automatically replaced by the image.

## Sizing

`BrandWall` renders logos at `h-8 md:h-10` with `w-auto`. SVGs scale crisply; PNGs should be ~80px tall at 2x (160px native) to look sharp.
