// Single source of truth for site copy + data.
// Rewrites Merrick Robert Media's positioning into a product-focused, lean
// voice (inspired by KODE Media). Everything renderable lives here so
// updating copy is a one-file job.

export const SITE = {
  name: 'Crushfilms',
  legalName: 'Merrick Robert Media LLC',
  tagline: 'Visuals for the next level.',
  promise:
    'A production studio for commercial, brand, and documentary work — built for teams who want their story to land, not just play.',
  email: 'info@merrickrobertmedia.com',
  phone: '', // hidden until a public number is provided
  studio: {
    line1: 'Production Studio',
    line2: 'Atlanta, GA',
  },
  // Authentic public profiles run by Merrick Ward / Crushfilms.
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
  /** Optional Vimeo id — when set, the services page renders an autoplay
   *  preview embed beneath the row's title. */
  vimeoId?: string;
};

export const SERVICES: Service[] = [
  {
    number: '01',
    title: 'Commercial Production',
    blurb:
      'High-craft commercials engineered for the metric you actually care about — not just the award reel.',
    capabilities: ['Concept + script', 'Direction', 'Cinematography', 'Edit + finish','ariel cinematography', '360/VR capture', 'CGI + VFX'],
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
    vimeoId: '1189619585',
  },
  {
    number: '04',
    title: 'Content Systems',
    blurb:
      'One shoot, ten months of content. We build production systems so your team ships consistently.',
    capabilities: ['Content strategy', 'Modular shoot days', 'Edit pipelines', 'Asset management', 'Behind the scenes capture'],
    vimeoId: '1189600869',
  },

  {
    number: '05',
    title: 'Live + Event Capture',
    blurb:
      'Multi-cam live capture and same-week social cut-downs — built for keynotes, launches, and gatherings.',
    capabilities: ['Multi-cam direction', 'Live switching', 'Same-day edits', 'Vertical + horizontal'],
    vimeoId: '1189950990',
  },
  {
    number: '06',
    title: 'Photography',
    blurb:
      'Capture the moments that matter with a photographer who understands how stills and video work together to tell your story.',
    capabilities: ["Portraits + headshots", "Event photography", "Product photography", "Lifestyle photography"],
  },
  {
    number: '07',
    title: 'Post-Production',
    blurb:
      'Edit, color, sound, and finish for projects that need a pair of hands at the end of the line.',
    capabilities: ['Story-first editing', 'Color grade', 'Sound design + mix', 'Deliverables'],
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
  // Crushfilms Vimeo profile.
  vimeoId?: string;
  // OPTIONAL: external watch URL override; when provided, takes precedence
  // over the auto-generated vimeo.com/<id> link.
  watchUrl?: string;
  // OPTIONAL: when set, PosterCard renders a self-hosted <video> (autoplay,
  // muted, looped) sourced from this path instead of a Vimeo embed. Takes
  // precedence over `vimeoId` inside PosterCard; `vimeoId` is still used by
  // the home-hero `HeroVimeoEmbed`.
  videoSrc?: string;
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
    client: 'Vertstory',
    title: 'Vertical, finally.',
    category: 'Brand Platform',
    year: '2025',
    blurb:
      'Short stories, told tall — a vertical-first home for films from the heart, not the studio.',
    accent: 'from-violet-500 via-fuchsia-500 to-rose-500',
    initials: 'VS',
    vimeoId: '1162412597',
    videoSrc: '/images/verstory_screen_recording.mov',
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
    vimeoId: '1162422041'
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
  /** Optional Vimeo id — shown in a hover card on the brand carousel. */
  vimeoId?: string;
};

export const BRANDS: Brand[] = [
  { name: 'Hanes Brands',                logo: '/logos/brands/HANES_BRAND.png',       vimeoId: '1143187919' },
  { name: 'AARP',                        logo: '/logos/brands/AARP.png' },
  { name: 'Winston-Salem Fashion Week',  logo: '/logos/brands/WSFW.png',              vimeoId: '1162412870' },
  { name: 'The Ayars Agency',            logo: '/logos/brands/AYARS_AGENCY.png',      vimeoId: '1129696793' },
  { name: 'Color Of Medicine',           logo: '/logos/brands/COLOR_OF_MEDICINE.png', vimeoId: '1188711217' },
  { name: 'Athora Care',                 logo: '/logos/brands/AUTHORA_CARE.png',    vimeoId: '1188741405' },
  { name: 'The Elijah Rock Foundation',  logo: '/logos/brands/ELIJAH_FOUNDATION.png' },
  { name: 'Alpha Style',                 logo: '/logos/brands/ALPHA_STYLE.png' },
  { name: "Alzheimer's Association",     logo: '/logos/brands/ALZHEIMERS.png' },
  { name: 'DesignPlus',                  logo: '/logos/brands/DESIGNPLUS.png',        vimeoId: '1126369059' },
  { name: 'Goodwill',                    logo: '/logos/brands/GOODWILL.png',          vimeoId: '1188678553' },
  { name: 'Life Lemons',                 logo: '/logos/brands/LIFE_LEMONS.png' },
  { name: 'YMCA',                        logo: '/logos/brands/YMCA.png',              vimeoId: '1188735824' },
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
