# Crushfilms — merrickrobertmedia.com

A Next.js + Tailwind rebuild of `merrickrobertmedia.com`, leaning into a
Kode-style production-studio aesthetic: dark, type-led, lean.

The site is configured to **statically export** so the entire thing can be
deployed as plain HTML/CSS/JS to Namecheap shared hosting (cPanel / FTP).

## Stack

- **Next.js 14** (App Router) with `output: 'export'` (fully static build)
- **Tailwind CSS** for styling, with custom tokens for the dark/minimal theme
- **Inter Tight** display + **Inter** body, loaded via `next/font` (self-hosted at build time)
- Motion is CSS + a tiny `IntersectionObserver` (no Framer Motion runtime — keeps the bundle ~minimal)
- Zero client state beyond the nav

## What's in this folder


```
crush_website/
├── app/, components/, lib/   # source code
├── out/                      # pre-built static export (ready to deploy)
├── README.md                 # this file
├── package.json, configs...
└── node_modules/             # already installed
```

> **Note:** the `out/` folder shipped with the project may contain a stale
> `out/out/` subdirectory and a stale CSS file from an earlier build (a
> sandbox quirk). They're harmless — running `npm run build` yourself
> produces a clean `out/`. You can also just `rm -rf out` and rebuild before
> uploading.

## Local development

```bash
npm install        # node_modules already exists, skip if no changes
npm run dev
# open http://localhost:3000
```

## Production build (static export)

```bash
npm install
npm run build
```

This produces a fully static site in `./out/`. The folder structure looks like:

```
out/
├── index.html              # Home
├── work/index.html         # /work/
├── services/index.html     # /services/
├── about/index.html        # /about/
├── contact/index.html      # /contact/
├── 404.html
└── _next/                  # static assets (CSS, JS, fonts)
```

## Deploying to Namecheap shared hosting

Namecheap shared hosting runs Apache + cPanel and supports static sites out
of the box. There is no Node runtime needed — just upload `out/`.

1. Run `npm run build` locally. You'll get an `out/` folder.
2. Open **Namecheap cPanel → File Manager**, navigate to `public_html/` (or
   the document root for the domain you're publishing to).
3. Upload **the contents of `out/`** (not the folder itself) into
   `public_html/`. Easiest way: zip `out/`'s contents, upload the zip via
   File Manager, then "Extract" in cPanel.
4. Verify the `_next/` directory uploaded successfully — that's where the
   CSS, JS, and fonts live.
5. Visit your domain. Each page lives at `/`, `/work/`, `/services/`,
   `/about/`, `/contact/`.

### Optional: tighter routing & caching with `.htaccess`

Drop this `.htaccess` in `public_html/` for clean URLs without trailing slashes
in the address bar (the underlying files still use trailing slashes — Apache
just hides them) and aggressive caching for `_next/` assets:

```apache
# Send /work to /work/ (folder lookup) without exposing the trailing slash
DirectoryIndex index.html
Options -MultiViews

# Friendly 404
ErrorDocument 404 /404.html

# Long-cache hashed Next.js assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\.(?:css|js|woff2|svg)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>
```

## Editing copy & content

All site copy and project data lives in [`lib/content.ts`](./lib/content.ts).
Updating services, work, clients, or studio info is a one-file change.

- `SITE` — name, tagline, contact, social
- `NAV` — top-level nav items
- `SERVICES` — capability cards (used on Home + Services)
- `WORK` — case studies (used on Home + Work + index strip)
- `CLIENTS` — names rendered into the marquee + logo wall
- `APPROACH` — process steps
- `STUDIO_FACTS` — the "12+ years" stat strip

## Adding real images & video

Posters in the case-study grid currently use CSS gradients + initials as
filmic placeholders so the design works without assets. To swap in real stills:

1. Drop images into `public/work/` (e.g. `public/work/northshore-anthem.jpg`).
2. Update `components/PosterCard.tsx` to render `<Image>` (use `next/image`
   with `unoptimized` since we're statically exporting) when an image path is
   present in the `CaseStudy`.
3. Add an optional `poster?: string` field to `CaseStudy` in
   `lib/content.ts` and fill it in per project.

## Project structure

```
app/                # routes (App Router)
  layout.tsx        # global shell + Nav + Footer
  globals.css       # tokens, base styles, reveal-on-scroll, marquee
  page.tsx          # Home
  work/page.tsx
  services/page.tsx
  about/page.tsx
  contact/page.tsx
  not-found.tsx

components/         # shared UI
  Nav.tsx           # sticky nav with mobile sheet
  Footer.tsx        # CTA + marquee + sitemap
  Reveal.tsx        # IntersectionObserver fade-up
  PosterCard.tsx    # case-study poster

lib/
  content.ts        # all site data + copy

next.config.mjs     # static export config
tailwind.config.ts  # design tokens
```

## Notes

- **Mail handling**: the contact form uses `mailto:` so it works on a static
  host with zero backend. If you'd prefer a hosted form (Formspree, Web3Forms,
  Netlify Forms, etc.), update the `<form action="...">` in
  `app/contact/page.tsx`.
- **Analytics**: add Plausible / Fathom / GA via a `<script>` tag in
  `app/layout.tsx` when you're ready.
