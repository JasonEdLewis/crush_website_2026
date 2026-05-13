import type { Metadata } from 'next';
import FaithInquireView from '@/components/FaithInquireView';
import { FAITH_PACKAGES } from '@/lib/content';

const SLUG = 'legacy';
const pkg = FAITH_PACKAGES.find((p) => p.slug === SLUG)!;

export const metadata: Metadata = {
  title: `${pkg.title} — Inquire · Merrick Robert Media / Crushfilms`,
  description: `Tailored intake for ${pkg.title}. ${pkg.blurb}`,
};

export default function LegacyInquirePage() {
  return <FaithInquireView slug={SLUG} />;
}
