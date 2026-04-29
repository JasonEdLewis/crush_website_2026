import type { SVGProps } from 'react';

/**
 * Hand-drawn monochromatic SVG icons for the social platforms we link to.
 * They use `currentColor` so the parent's text color drives them — that's
 * why a single `text-ink-200 hover:text-ink-50` rule works across all of them.
 */

export type SocialKey =
  | 'instagram'
  | 'vimeo'
  | 'youtube'
  | 'facebook'
  | 'linkedin'
  | 'cross';

const STROKE: SVGProps<SVGSVGElement> = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const FILL: SVGProps<SVGSVGElement> = { fill: 'currentColor' };

export default function SocialIcon({
  name,
  className = 'h-5 w-5',
  ...rest
}: { name: SocialKey; className?: string } & SVGProps<SVGSVGElement>) {
  switch (name) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" className={className} {...STROKE} {...rest} aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );

    case 'vimeo':
      // simplified "V" wedge — clean, recognizable at 20px
      return (
        <svg viewBox="0 0 24 24" className={className} {...FILL} {...rest} aria-hidden>
          <path d="M22.5 7.6c-.4 4-3.5 9.5-7.6 13.4-2 2-3.5.5-4.4-2-.5-1.7-1.4-7-2-8.7-.4-1.1-1-2.3-2.2-1.5L4 11l-2-2.6c1.5-1.3 3-2.6 4.5-3.9 1.6-1.5 3.5-1.7 4.3.7L12 11.7c.4 2 1 3 1.7 3 .9 0 2.4-1.3 3.4-3.5 1-2.2.6-4.1-1.7-4-1 .1-2 .5-2.9 1.1 1.5-3.5 4.5-5.2 9-4.7 2 .2 1.4 2.2 1 4z" />
        </svg>
      );

    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" className={className} {...FILL} {...rest} aria-hidden>
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.04C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.29 29 29 0 0 0-.46-5.33z" />
          <path d="M9.75 15.02 15.5 11.75 9.75 8.48v6.54z" fill="#0a0a0a" />
        </svg>
      );

    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" className={className} {...FILL} {...rest} aria-hidden>
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
        </svg>
      );

    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" className={className} {...FILL} {...rest} aria-hidden>
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.66h-3.55V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.27V1.72C24 .77 23.21 0 22.22 0z" />
        </svg>
      );

    case 'cross':
      // solid latin cross — matches the Font Awesome / Web Awesome `cross` glyph
      return (
        <svg viewBox="0 0 384 512" className={className} {...FILL} {...rest} aria-hidden>
          <path d="M176 0c-17.7 0-32 14.3-32 32v96H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h112v224c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V256h112c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32H240V32c0-17.7-14.3-32-32-32h-32z" />
        </svg>
      );
  }
}
