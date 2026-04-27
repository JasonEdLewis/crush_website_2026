import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center px-6 lg:px-10 pt-32 pb-24 noise relative overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[36rem] w-[36rem] rounded-full bg-crush-500/25 blur-[160px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="h-eyebrow mb-8 justify-center">Error 404</p>
        <h1 className="font-display font-semibold text-display-1 tracking-tightest leading-[0.92]">
          Cut. <span className="text-ink-400">This take doesn&rsquo;t exist.</span>
        </h1>
        <p className="mt-8 text-ink-300">
          The page you&rsquo;re looking for didn&rsquo;t make the final edit.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/" className="btn btn-primary">
            Back to home →
          </Link>
          <Link href="/work/" className="btn btn-ghost">
            See the work
          </Link>
        </div>
      </div>
    </section>
  );
}
