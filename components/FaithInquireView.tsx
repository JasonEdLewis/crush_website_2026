import Link from 'next/link';
import { notFound } from 'next/navigation';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import InquireForm from '@/components/InquireForm';
import { FAITH_PACKAGES } from '@/lib/content';

/**
 * Shared body for the /faith/inquire/<slug>/ pages. Each per-slug page is a
 * static route that just hands the slug to this view — avoids the Next 14
 * dev-mode quirk where `output: 'export'` + dynamic `[param]` routes can
 * fail to register `generateStaticParams` at request time.
 */
export default function FaithInquireView({ slug }: { slug: string }) {
  const pkg = FAITH_PACKAGES.find((p) => p.slug === slug);
  if (!pkg) notFound();

  return (
    <>
      {/* page header */}
      <section className="relative overflow-hidden noise pt-32 md:pt-40 pb-12 border-b border-white/5">
        <div className="grid-bg absolute inset-0 opacity-40" aria-hidden />
        <div
          className="absolute -top-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-crush-500/20 blur-[160px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
          <Reveal>
            <Link
              href="/faith/#packages"
              className="h-eyebrow inline-flex items-center gap-3 text-ink-400 hover:text-ink-200 transition-colors"
            >
              <span aria-hidden>←</span>
              <span>Back to packages</span>
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <p className="h-eyebrow mt-10 text-crush-500">{pkg.intake.eyebrow}</p>
          </Reveal>

          <h1 className="mt-6 font-display font-semibold text-display-2 tracking-tightest max-w-4xl">
            <SplitText immediate delay={180} stagger={70}>
              {pkg.intake.headline}
            </SplitText>
          </h1>

          <Reveal delay={320}>
            <p className="mt-8 max-w-2xl text-lg text-ink-300 leading-snug">
              {pkg.intake.blurb}
            </p>
          </Reveal>
        </div>
      </section>

      {/* package context card + form */}
      <section className="px-6 lg:px-10 pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* package summary (sticky on lg+) */}
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 rounded-2xl border border-white/10 bg-ink-950/40 p-6 md:p-7">
              <p className="h-eyebrow mb-4">You're inquiring about</p>
              <h2 className="font-display font-semibold text-2xl md:text-3xl tracking-tightest leading-[1.05]">
                {pkg.title}
              </h2>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-2xl md:text-3xl tracking-tightest text-ink-50">
                  {pkg.price}
                </span>
                <span className="text-xs text-ink-500">{pkg.cadence}</span>
              </div>
              <p className="mt-5 text-sm text-ink-300 leading-relaxed">
                {pkg.blurb}
              </p>
              <div className="mt-5 h-px w-full bg-white/5" aria-hidden />
              <p className="mt-5 text-xs text-ink-500 leading-relaxed">
                Want a different package?{' '}
                <Link
                  href="/faith/#packages"
                  className="text-ink-200 link-underline"
                >
                  Compare all three
                </Link>
                .
              </p>
            </div>
          </Reveal>

          {/* tailored intake form */}
          <Reveal className="lg:col-span-8" delay={120}>
            <InquireForm pkg={pkg} />
          </Reveal>
        </div>
      </section>
    </>
  );
}

