// Single source of truth for site copy + data.
// Rewrites Merrick Robert Media's positioning into a product-focused, lean
// voice (inspired by KODE Media). Everything renderable lives here so
// updating copy is a one-file job.

export const SITE = {
  name: 'Crush Films',
  legalName: 'Merrick Robert Media LLC',
  tagline: 'Visuals for the next level.',
  promise:
    'A production studio for commercial, brand, and documentary work — built for teams who want their story to land, not just play.',
  email: 'merrickrobertmedia@gmail.com',
  phone: '', // hidden until a public number is provided
  studio: {
    line1: 'Production Studio',
    line2: 'Atlanta, GA',
  },
  // Authentic public profiles run by Merrick Ward / Crush Films.
  // `icon` is a key in components/SocialIcon.tsx — keep them in sync.
  social: [
    { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/crushfilms/' },
    { label: 'Vimeo',     icon: 'vimeo',     href: 'https://vimeo.com/merrickrobertmedia' },
    { label: 'YouTube',   icon: 'youtube',   href: 'https://www.youtube.com/@crushfilms' },
    { label: 'Facebook',  icon: 'facebook',  href: 'https://www.facebook.com/Crushfilms/' },
    { label: 'LinkedIn',  icon: 'linkedin',  href: 'https://www.linkedin.com/in/merrick-ward-167468ab/' },
  ],
  // Vimeo profile to use when a CaseStudy doesn't have its own vimeoId yet.
  vimeoProfile: 'https://vimeo.com/merrickrobertmedia',
} as const;

export const NAV = [
  { label: 'Work',     href: '/work/' },
  { label: 'Services', href: '/services/' },
  { label: 'About',    href: '/about/' },
  { label: 'Contact',  href: '/contact/' },
] as const;

// ---------- services ----------

export type Service = {
  number: string;
  title: string;
  blurb: string;
  capabilities: string[];
};

export const SERVICES: Service[] = [
  {
    number: '01',
    title: 'Commercial Production',
    blurb:
      'High-craft commercials engineered for the metric you actually care about — not just the award reel.',
    capabilities: ['Concept + script', 'Direction', 'Cinematography', 'Edit + finish'],
  },
  {
    number: '02',
    title: 'Brand Films',
    blurb:
      'Founder stories, manifestos, and anthem pieces that give your brand a voice people quote back to you.',
    capabilities: ['Story development', 'Interview craft', 'Visual identity', 'Distribution-ready edits'],
  },
  {
    number: '03',
    title: 'Documentary',
    blurb:
      'Honest, character-led films for nonprofits, founders, and initiatives worth witnessing — start to finish.',
    capabilities: ['Research + access', 'Vérité direction', 'Original score', 'Festival-grade post'],
  },
  {
    number: '04',
    title: 'Content Systems',
    blurb:
      'One shoot, ten months of content. We build production systems so your team ships consistently.',
    capabilities: ['Content strategy', 'Modular shoot days', 'Edit pipelines', 'Asset management'],
  },
  {
    number: '05',
    title: 'Post-Production',
    blurb:
      'Edit, color, sound, and finish for projects that need a pair of hands at the end of the line.',
    capabilities: ['Story-first editing', 'Color grade', 'Sound design + mix', 'Deliverables'],
  },
  {
    number: '06',
    title: 'Live + Event Capture',
    blurb:
      'Multi-cam live capture and same-week social cut-downs — built for keynotes, launches, and gatherings.',
    capabilities: ['Multi-cam direction', 'Live switching', 'Same-day edits', 'Vertical + horizontal'],
  },
];

// ---------- work / case studies ----------

export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  category: string;
  year: string;
  blurb: string;
  // tailwind gradient + a one-letter accent to stand in for hero stills
  accent: string; // e.g. 'from-rose-500 to-orange-500'
  initials: string;
  // OPTIONAL: drop in a Vimeo video id (digits only — e.g. "492156331")
  // and the PosterCard will render the real embed + a link to vimeo.com.
  // Leave undefined to fall back to the gradient placeholder + a link to the
  // Crush Films Vimeo profile.
  vimeoId?: string;
  // OPTIONAL: external watch URL override; when provided, takes precedence
  // over the auto-generated vimeo.com/<id> link.
  watchUrl?: string;
};

/**
 * Real videos hosted on https://vimeo.com/merrickrobertmedia.
 *
 * `vimeoId` = the digits in the vimeo.com/<id> URL. Used by PosterCard and
 * VimeoEmbed to render real players and "Watch on Vimeo" deep-links.
 *
 * To rename, recategorise, or reorder — just edit this array.
 */
export const WORK: CaseStudy[] = [
  {
    slug: 'reel-2025',
    client: 'Merrick Robert Media',
    title: 'The reel.',
    category: 'Showreel',
    year: '2025',
    blurb:
      'A rolling cut of recent commercial, brand, and documentary work. Best watched loud.',
    accent: 'from-crush-500 via-rose-500 to-amber-400',
    initials: 'MR',
    vimeoId: '1139830528',
  },
  {
    slug: 'feature-spot',
    client: 'Merrick Robert Media',
    title: 'A spot designed to be quoted back to you.',
    category: 'Commercial',
    year: '2025',
    blurb:
      'High-craft commercial work — sharp script, sharper edit, built to land in a feed.',
    accent: 'from-amber-500 via-orange-500 to-rose-500',
    initials: 'CM',
    vimeoId: '1162422041',
  },
  {
    slug: 'brand-anthem',
    client: 'Merrick Robert Media',
    title: 'A brand film that doesn’t feel like an ad.',
    category: 'Brand Film',
    year: '2024',
    blurb:
      'Narrative-led piece about the people behind the product. No stock footage, no clichés.',
    accent: 'from-emerald-400 via-teal-500 to-sky-500',
    initials: 'AN',
    vimeoId: '1126369059',
  },
  {
    slug: 'short-film',
    client: 'Merrick Robert Media',
    title: 'A short you’ll want to rewind.',
    category: 'Short Film',
    year: '2024',
    blurb:
      'Story-led short with the kind of framing and pacing usually reserved for festival cuts.',
    accent: 'from-indigo-500 via-violet-500 to-fuchsia-500',
    initials: 'SF',
    vimeoId: '1138331114',
  },
];

/** Build a watch URL for a CaseStudy (custom > vimeo id > profile fallback). */
export function watchHrefFor(item: CaseStudy): string {
  if (item.watchUrl) return item.watchUrl;
  if (item.vimeoId) return `https://vimeo.com/${item.vimeoId}`;
  return SITE.vimeoProfile;
}

// ---------- brands / clients ----------
//
// Each entry can optionally point at a real logo image in /public/logos/.
// To add a real logo: drop the file (SVG preferred, PNG OK) into
// /public/logos/<slug>.svg and set `logo: '/logos/<slug>.svg'` here.
// Until then, BrandWall renders a tasteful typography wordmark fallback.

export type Brand = {
  name: string;
  /** Path under /public, e.g. '/logos/hanes.svg'. Optional. */
  logo?: string;
  /** Optional location tag rendered in the wordmark fallback. */
  location?: string;
};

export const BRANDS: Brand[] = [
  { name: 'Hanes Brands' },
  { name: 'G Davis Productions and Films' },
  { name: 'Winston-Salem Fashion Week' },
  { name: 'AARP' },
  { name: 'The Ayars Agency' },
  { name: 'Men That Win',                    location: 'NC' },
  { name: 'JC Cosmetics',                    location: 'NC' },
  { name: 'Color Of Medicine',               location: 'NC' },
  { name: 'Goldson Family Services',         location: 'NC' },
  { name: 'Palm Beach Lounge',               location: 'Atlanta' },
  { name: 'Athora Care',                     location: 'NC' },
  { name: 'Caring Hands Home Care',          location: 'NC' },
  { name: 'The Elijah Rock Foundation',      location: 'Iowa' },
];

/** Backwards-compat: footer marquee + any other consumers that just need names. */
export const CLIENTS: string[] = BRANDS.map((b) => b.name);

// ---------- approach / process ----------

export const APPROACH = [
  {
    step: '01',
    title: 'Listen first',
    body: 'Before a single frame: what business outcome is this film responsible for? We start there, not in pre-pro.',
  },
  {
    step: '02',
    title: 'Story, then shot list',
    body: 'A clear narrative spine before the camera roll. If the story does not work on paper, it will not work on screen.',
  },
  {
    step: '03',
    title: 'A small, sharp crew',
    body: 'Senior people in every key role. Lean enough to move fast; experienced enough to make the right call on set.',
  },
  {
    step: '04',
    title: 'Edit in public',
    body: 'You see cuts as they evolve, not just at the end. Fewer surprises, sharper feedback, better final film.',
  },
];

// ---------- about / studio facts ----------

export const STUDIO_FACTS = [
  { value: '12+',   label: 'Years building brand stories'  },
  { value: '180+',  label: 'Films shipped to date'         },
  { value: '40M+',  label: 'Views earned for our clients'  },
  { value: '2',     label: 'Coffees consumed before lunch' },
];
