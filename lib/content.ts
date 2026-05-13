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
  /** Optional hero image for a service row without a Vimeo preview. */
  imageSrc?: string;
};

export const SERVICES: Service[] = [
  {
    number: '01',
    title: 'Commercial Production',
    blurb:
      'High-craft commercials engineered for the metric you actually care about — not just the award reel.',
    capabilities: ['Concept + script', 'Direction', 'Cinematography', 'Edit + finish','ariel cinematography', '360/VR capture', 'CGI + VFX'],
    vimeoId: '1162422041',
  },
  {
    number: '02',
    title: 'Brand Films',
    blurb:
      'Founder stories, manifestos, and anthem pieces that give your brand a voice people quote back to you.',
    capabilities: ['Story development', 'Interview craft', 'Visual identity', 'Distribution-ready edits'],
    vimeoId: '1126369059',
  },
  {
    number: '03',
    title: 'Documentary',
    blurb:
      'Honest, character-led films for nonprofits, founders, and initiatives worth witnessing — start to finish.',
    capabilities: ['Research + access', 'Vérité direction', 'Original score', 'Festival-grade post'],
    vimeoId: '1191044703',
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
    imageSrc: '/images/MKphotos-7.jpg',
  },
  {
    number: '07',
    title: 'Post-Production',
    blurb:
      'Edit, color, sound, and finish for projects that need a pair of hands at the end of the line.',
    capabilities: ['Story-first editing', 'Color grade', 'Sound design + mix', 'Deliverables'],
    vimeoId: '1191043448',
  },
];

// ---------- faith-based: church media packages ----------

export type FaithPackageField = {
  /** POSTed name — also used as the label on the email when contact.php
   *  echoes unknown fields. Stick to snake_case ASCII. */
  name: string;
  label: string;
  /** Helper / placeholder text shown inside the input. */
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  rows?: number;
};

export type FaithPackage = {
  slug: string;
  tier: string;
  title: string;
  blurb: string;
  price: string;
  cadence: string;
  featured?: boolean;
  sections: { label: string; items: string[] }[];
  ctaLabel: string;
  /** Tailored intake form rendered at /faith/inquire/<slug>/. */
  intake: {
    eyebrow: string;
    headline: string;
    blurb: string;
    fields: FaithPackageField[];
  };
};

/** Common contact fields rendered above the package-specific intake fields
 *  on every /faith/inquire/<slug>/ page. */
export const FAITH_INTAKE_COMMON_FIELDS: FaithPackageField[] = [
  { name: 'name',        label: 'Your name',           type: 'text',  required: true },
  { name: 'email',       label: 'Email',               type: 'email', required: true },
  { name: 'phone',       label: 'Phone (optional)',    type: 'tel' },
  { name: 'church_name', label: 'Church or ministry',  type: 'text',  required: true },
  { name: 'city',        label: 'City / region',       type: 'text',  required: true },
];

export const FAITH_PACKAGES: FaithPackage[] = [
  {
    slug: 'foundation',
    tier: 'Entry package',
    title: 'The Foundation',
    blurb:
      'For churches ready to start telling their story on social with professional production.',
    price: '$1,500 – $2,500',
    cadence: 'per event or project',
    sections: [
      {
        label: "What's included",
        items: [
          '1 church event covered (sermon series launch, revival, anniversary)',
          '4–6 vertical reels cut for Instagram & TikTok',
          '1 highlight film (3–5 min) for YouTube + site',
          '1 pastor profile clip — 60–90 sec "who am I" brand film',
          'Same-day BTS stills for social',
        ],
      },
      {
        label: 'Ideal for',
        items: [
          'Churches with 100–500 members just building their online presence',
        ],
      },
    ],
    ctaLabel: 'Inquire about The Foundation',
    intake: {
      eyebrow: 'The Foundation · $1,500 –$2,500 per event or project',
      headline: 'Tell us about your event.',
      blurb:
        'A few details about the event you want covered — we’ll come back with a scope and a date hold within two business days.',
      fields: [
        {
          name: 'congregation_size',
          label: 'Approximate congregation size',
          placeholder: 'e.g. ~250 members',
          type: 'text',
        },
        {
          name: 'event_type',
          label: 'What event is this for?',
          placeholder:
            'Sermon series launch, revival, anniversary, conference, baptism Sunday — what’s the moment?',
          type: 'textarea',
          rows: 3,
          required: true,
        },
        {
          name: 'target_date',
          label: 'Tentative date or window',
          placeholder: 'e.g. weekend of Oct 18, or "mid-November"',
          type: 'text',
        },
        {
          name: 'the_win',
          label: 'What does a "win" look like for you?',
          placeholder:
            'New members, social growth, a film to anchor the next series, donor moments — what should this produce?',
          type: 'textarea',
          rows: 4,
        },
      ],
    },
  },
  {
    slug: 'momentum',
    tier: 'Growth retainer · Most popular',
    title: 'The Momentum Retainer',
    blurb:
      'Monthly production partner — we handle the content engine so the church can focus on ministry.',
    price: '$3,500 – $6,000',
    cadence: 'per month',
    featured: true,
    sections: [
      {
        label: 'Monthly deliverables',
        items: [
          '4 sermon recap reels (one per Sunday)',
          'Full coverage of 1–2 church events / month',
          '2 pastor-brand pieces (teaching clip, "behind the vision" moment)',
          '1 monthly mini-doc or testimony story (2–4 min)',
          'Monthly content calendar + caption strategy',
          'Thumbnail + cover art refreshes each series',
        ],
      },
      {
        label: 'Growth levers',
        items: [
          'Replicates the Elevation / Highlands content-to-growth model',
        ],
      },
    ],
    ctaLabel: 'Start a retainer conversation',
    intake: {
      eyebrow: 'The Momentum Retainer · $3,500–$6,000 / month',
      headline: 'Let’s build the engine together.',
      blurb:
        'A monthly partnership only works if we’re aligned on the cadence and the vision. A few questions to make our first conversation count.',
      fields: [
        {
          name: 'congregation_size',
          label: 'Approximate congregation size',
          placeholder: 'e.g. ~800 members; ~1.2k weekly attendance',
          type: 'text',
        },
        {
          name: 'online_presence',
          label: 'Current online presence',
          placeholder:
            'Channels (YouTube, IG, TikTok, podcast) + rough audience size on each.',
          type: 'textarea',
          rows: 4,
        },
        {
          name: 'comms_team',
          label: 'In-house comms / media team',
          placeholder:
            'Who’s on the team today (volunteer or paid)? Anyone shooting, editing, or running social?',
          type: 'textarea',
          rows: 3,
        },
        {
          name: 'start_window',
          label: 'Hoped-for start window',
          placeholder: 'e.g. "next series in January" or "ASAP"',
          type: 'text',
        },
        {
          name: 'twelve_month_vision',
          label: 'The 12-month vision',
          placeholder:
            'What do you want this church\'s online presence to look like a year from now?',
          type: 'textarea',
          rows: 4,
          required: true,
        },
      ],
    },
  },
  {
    slug: 'legacy',
    tier: 'High-end partnership',
    title: 'The Legacy Series',
    blurb:
      'A full media partnership built around a documentary series that grows the pastor’s platform and puts the church on the map nationally.',
    price: '$12,000 – $25,000',
    cadence: 'per series or annual',
    sections: [
      {
        label: "What's included",
        items: [
          '4–6 episode original documentary or interview series (YouTube-first)',
          'Full series development, shoot days, edit pipeline, distribution strategy',
          'Sponsor & partner deck built to offset production cost',
          'Pastor brand identity film (5–8 min cinematic profile)',
          'Press kit + media assets for outreach, speaking invites, book deals',
          'Full retainer content throughout the series run',
        ],
      },
      {
        label: 'Outcome',
        items: [
          'National brand visibility — positions the pastor for speaking circuit + media',
        ],
      },
    ],
    ctaLabel: 'Pitch a Legacy Series',
    intake: {
      eyebrow: 'The Legacy Series · $12,000–$25,000 / series or annual',
      headline: 'Tell us about the story you want to tell.',
      blurb:
        'A Legacy Series is a multi-month partnership — the more context we have up front, the sharper our first read can be.',
      fields: [
        {
          name: 'pastor_name',
          label: "Pastor's name",
          type: 'text',
          required: true,
        },
        {
          name: 'big_idea',
          label: 'The big idea',
          placeholder:
            'What’s the story arc you imagine over 4–6 episodes? Why now?',
          type: 'textarea',
          rows: 5,
          required: true,
        },
        {
          name: 'existing_platform',
          label: 'Existing platform',
          placeholder:
            'YouTube subs, social reach, podcast, speaking engagements, book deals — what’s already in motion?',
          type: 'textarea',
          rows: 4,
        },
        {
          name: 'sponsor_conversations',
          label: 'Sponsor / partner conversations underway?',
          placeholder: 'Anyone we should know about — or is this fully self-funded?',
          type: 'textarea',
          rows: 3,
        },
        {
          name: 'target_launch',
          label: 'Target launch window',
          placeholder: 'e.g. premiere by next Easter, or "no fixed date yet"',
          type: 'text',
        },
      ],
    },
  },
];

// ---------- work / case studies ----------

export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  category: string;
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
    blurb:
      'Short stories, told tall — a vertical-first home for films from the heart, not the studio.',
    accent: 'from-violet-500 via-fuchsia-500 to-rose-500',
    initials: 'VS',
    vimeoId: '1190992459',
    videoSrc: '/images/verstory_screen_recording.mov',
  },
  {
    slug: 'brand-anthem',
    client: 'Merrick Robert Media',
    title: 'A brand film that doesn’t feel like an ad.',
    category: 'Brand Film',
    blurb:
      'Narrative-led piece about the people behind the product. No stock footage, no clichés.',
    accent: 'from-emerald-400 via-teal-500 to-sky-500',
    initials: 'AN',
    vimeoId: '1191341352',
  },
  {
    slug: 'documentary',
    client: 'G Davis Productions & Films',
    title: 'A brand film that doesn’t feel like an ad.',
    category: 'Brand Film',
    blurb:
      'A long-form collaboration with G Davis Productions — documentary craft that earns its runtime instead of asking for it.',
    accent: 'from-emerald-400 via-teal-500 to-sky-500',
    initials: 'AN',
    vimeoId: '1191044703',
  },
  {
    slug: 'documentary',
    client: 'Hanes Brands',
    title: 'A short you’ll want to rewind.',
    category: 'Short Film',
    blurb:
      'A short for Hanes that trades product beats for narrative grain — apparel imagery with the patience to actually mean something.',
    accent: 'from-indigo-500 via-violet-500 to-fuchsia-500',
    initials: 'SF',
    vimeoId: '1143187919',
  },
  {
    slug: 'national-stage-play',
    client: 'G Davis Productions & Films',
    title: 'Unforgetable',
    category: 'Commercial',
    blurb:
      'High-craft commercial work — sharp script, sharper edit, built to land in a feed.',
    accent: 'from-amber-500 via-orange-500 to-rose-500',
    initials: 'CM',
    vimeoId: '1189998684'
  },
   
  {
    slug: 'golf-tournament',
    client: 'G Davis Productions & Films',
    title: "'Forget Me Not' Golf Tournament",
    category: 'Event',
    blurb:
      'Event coverage of the Forget Me Not Tournament — cause, crowd, and craft cut into a recap a sponsor can actually run with.',
    accent: 'from-indigo-500 via-violet-500 to-fuchsia-500',
    initials: 'SF',
    vimeoId: '1191338025',
  },
  {
    
    slug: 'brand-anthem',
    client: 'Authora Care',
    title: 'A short you’ll want to rewind.',
    category: 'Short Film',
    blurb:
      'A short with Authora Care on end-of-life work — tender, observational, and built without slipping into the sentimental shortcuts the category usually leans on.',
    accent: 'from-indigo-500 via-violet-500 to-fuchsia-500',
    initials: 'SF',
    vimeoId: '1188741405',
  },
  {
    slug: 'tree-business',
    client: 'Luber Jacks Tree Service',
    title: 'A short you’ll want to rewind.',
    category: 'Short Film',
    blurb:
      'A small-business spot with real grit — Luber Jacks on the job, cut for local trust and a feed-stopping thumbnail.',
    accent: 'from-indigo-500 via-violet-500 to-fuchsia-500',
    initials: 'SF',
    vimeoId: '1162415016',
  },
  
  {
    
    slug: 'short-film',
    client: 'Hanses Brands',
    title: 'Copper Allen| Influencer',
    category: 'Short Film',
    blurb:
      'An influencer-led short with Copper Allen for Hanes — personality forward, performance built for the platform it actually lives on.',
    accent: 'from-indigo-500 via-violet-500 to-fuchsia-500',
    initials: 'SF',
    vimeoId: '1162418072',
  },
  {
    slug: 'short-film',
    client: 'Jason Lewis',
    title: '911 | Daily Life',
    category: 'Short Film',
    blurb:
      'A day-in-the-life portrait of Jason Lewis behind a 911 line — quiet, observational, and anything but routine.',
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
  { name: 'Hanes Brands',                logo: '/logos/brands/HANES_BRAND.png',       vimeoId: '1162417777' },
  { name: 'AARP',                        logo: '/logos/brands/AARP.png' ,             vimeoId: '' },
  { name: 'Winston-Salem Fashion Week',  logo: '/logos/brands/WSFW.png',              vimeoId: '1162412870' },
  { name: 'The Ayars Agency',            logo: '/logos/brands/AYARS_AGENCY.png',      vimeoId: '1129696793' },
  { name: 'Color Of Medicine',           logo: '/logos/brands/COLOR_OF_MEDICINE.png', vimeoId: '1188711217' },
  { name: 'Athora Care',                 logo: '/logos/brands/AUTHORA_CARE.png',    vimeoId: '1188741405' },
  { name: 'The Elijah Rock Foundation',  logo: '/logos/brands/ELIJAH_FOUNDATION.png' },
  { name: 'Alpha Style',                 logo: '/logos/brands/ALPHA_STYLE.png' },
  { name: "Alzheimer's Association",     logo: '/logos/brands/ALZHEIMERS.png' },
  { name: 'DesignPlus',                  logo: '/logos/brands/DESIGNPLUS.png',        vimeoId: '1126369059' },
  { name: 'Goodwill',                    logo: '/logos/brands/GOODWILL.png',          vimeoId: '1188678553' },
  { name: 'Palm Beach Lounge',           logo: '/logos/brands/PALM_BEACH_LOUNGE.png', vimeoId: '1191371515' },
  { name: 'YMCA',                        logo: '/logos/brands/YMCA.png',              vimeoId: '1191216314' },
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

export const STUDIO_FACTS: { value: string; label: string }[] = [
  // { value: '12+',   label: 'Years building brand stories'  },
  // { value: '180+',  label: 'Films shipped to date'         },
  // { value: '40M+',  label: 'Views earned for our clients'  },
  // { value: '2',     label: 'Coffees consumed before lunch' },
];
