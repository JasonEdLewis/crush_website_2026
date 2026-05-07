import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import Parallax from '@/components/Parallax';
import { SITE } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Brief received — Crushfilms',
  description: `Thanks for the brief. We'll reply within two business days from ${SITE.email}.`,
  robots: { index: false, follow: false },
};

export default function ContactThanksPage() {
  return (
    <>
      <section className="relative overflow-hidden noise pt-32 md:pt-40 pb-24 md:pb-40 border-b border-white/5">
        <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
        <div
          className="absolute -top-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-crush-500/25 blur-[160px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-8xl px-6 lg:px-10">
          <Reveal>
            <p className="h-eyebrow mb-8 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-ink-400" />
              Brief received
            </p>
          </Reveal>
          <Parallax speed={-0.1}>
            <h1 className="font-display font-semibold text-display-1 tracking-tightest max-w-5xl">
              <SplitText immediate delay={120} stagger={75}>Thanks —</SplitText>{' '}
              <SplitText immediate delay={400} stagger={75} className="text-ink-400">
                we&rsquo;ve got it.
              </SplitText>
            </h1>
          </Parallax>
          <Reveal delay={260}>
            <p className="mt-10 max-w-2xl text-lg text-ink-300 leading-snug">
              A real human reads every brief. Expect a reply within two business
              days with a point of view, a scope, and an honest read on fit.
            </p>
          </Reveal>
          <Reveal delay={380}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link href="/services/" className="btn btn-primary">
                View our services →
              </Link>
              <Link href="/" className="btn btn-ghost">
                Back to home
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
