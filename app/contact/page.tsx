import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import Parallax from '@/components/Parallax';
import { SITE } from '@/lib/content';
import SocialIcon, { type SocialKey } from '@/components/SocialIcon';

export const metadata: Metadata = {
  title: 'Contact — Crushfilms',
  description: `Start a project with ${SITE.name}. Email ${SITE.email}.`,
};

const BUDGETS = ['< $25k', '$25k–$75k', '$75k–$150k', '$150k+', 'Not sure yet'];
const SERVICE_OPTIONS = [
  'Commercial',
  'Brand Film',
  'Documentary',
  'Content System',
  'Post-Production',
  'Live + Event',
  'Something else',
];

export default function ContactPage() {
  return (
    <>
      {/* page header */}
      <section className="relative overflow-hidden noise pt-32 md:pt-40 pb-16 border-b border-white/5">
        <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
        <div
          className="absolute -top-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-crush-500/30 blur-[160px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-8xl px-6 lg:px-10">
          <Reveal>
            <p className="h-eyebrow mb-8 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-ink-400" />
              Contact
            </p>
          </Reveal>
          <Parallax speed={-0.1}>
            <h1 className="font-display font-semibold text-display-1 tracking-tightest max-w-5xl">
              <SplitText immediate delay={120} stagger={75}>Tell us about it.</SplitText>{' '}
              <SplitText immediate delay={500} stagger={75} className="text-ink-400">
                Even a sentence is enough.
              </SplitText>
            </h1>
          </Parallax>
          <Reveal delay={260}>
            <p className="mt-10 max-w-2xl text-lg text-ink-300 leading-snug">
              We read every brief that lands here, and reply within two
              business days with a point of view, a scope, and an honest read.
            </p>
          </Reveal>
        </div>
      </section>

      {/* form + side info */}
      <section className="px-6 lg:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-8xl grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* form */}
          <Reveal className="lg:col-span-7">
            <form
              action="/contact.php"
              method="post"
              className="space-y-8"
            >
              {/* honeypot — real users leave this empty; bots fill it. */}
              <div aria-hidden className="hidden" style={{ position: 'absolute', left: '-9999px' }}>
                <label>
                  Website
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <Field label="Your name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Company / brand" name="company" />
              <Field
                label="What are you trying to do?"
                name="brief"
                multiline
                required
                placeholder="One paragraph is plenty. We'll come back with questions."
              />

              <Fieldset legend="What kind of project?">
                <div className="flex flex-wrap gap-2">
                  {SERVICE_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-ink-300 cursor-pointer hover:border-white/30 hover:text-ink-50 transition has-[:checked]:bg-ink-50 has-[:checked]:text-ink-950 has-[:checked]:border-ink-50"
                    >
                      <input
                        type="checkbox"
                        name="service[]"
                        value={opt}
                        className="sr-only"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </Fieldset>

              <Fieldset legend="Budget range">
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <label
                      key={b}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-ink-300 cursor-pointer hover:border-white/30 hover:text-ink-50 transition has-[:checked]:bg-crush-500 has-[:checked]:text-ink-950 has-[:checked]:border-crush-500"
                    >
                      <input type="radio" name="budget" value={b} className="sr-only" />
                      {b}
                    </label>
                  ))}
                </div>
              </Fieldset>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button type="submit" className="btn btn-primary">
                  Send brief →
                </button>
                <p className="text-xs text-ink-500">
                  We typically reply within two business days.
                </p>
              </div>
            </form>
          </Reveal>

          {/* side info — hidden on phone; shown from tablet up */}
          <Reveal className="hidden md:block lg:col-span-5" delay={150}>
            <div className="space-y-12">
              <div>
                <p className="h-eyebrow mb-3">Direct</p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-display text-2xl md:text-3xl tracking-tighter link-underline"
                >
                  {SITE.email}
                </a>
                {SITE.phone ? (
                  <a href={`tel:${SITE.phone}`} className="block mt-2 text-ink-400">
                    {SITE.phone}
                  </a>
                ) : null}
              </div>

              <div>
                <p className="h-eyebrow mb-3">Studio</p>
                <p className="text-ink-200">{SITE.name}</p>
                <p className="text-ink-400">{SITE.studio.line1}</p>
                <p className="text-ink-400">{SITE.studio.line2}</p>
              </div>

              <div>
                <p className="h-eyebrow mb-3">For press &amp; recruiters</p>
                <a href={`mailto:${SITE.email}`} className="link-underline text-ink-200">
                  {SITE.email}
                </a>
              </div>

              <div>
                <p className="h-eyebrow mb-3">Elsewhere</p>
                <ul className="flex flex-wrap items-center gap-2">
                  {SITE.social.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.label}
                        title={s.label}
                        className="
                          group inline-flex h-10 w-10 items-center justify-center
                          rounded-full border border-white/10 text-ink-300
                          transition-all duration-500 ease-out-quint
                          hover:border-crush-500 hover:text-crush-500 hover:-translate-y-0.5
                        "
                      >
                        <SocialIcon name={s.icon as SocialKey} className="h-[18px] w-[18px]" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

// ----- form primitives -----

function Field({
  label,
  name,
  type = 'text',
  required = false,
  multiline = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="h-eyebrow block mb-3">{label}{required && ' *'}</span>
      {multiline ? (
        <textarea
          name={name}
          rows={5}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent border-b border-white/15 focus:border-ink-50 outline-none py-3 text-ink-50 placeholder-ink-500 transition-colors duration-300 resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className="w-full bg-transparent border-b border-white/15 focus:border-ink-50 outline-none py-3 text-ink-50 placeholder-ink-500 transition-colors duration-300"
        />
      )}
    </label>
  );
}

function Fieldset({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="h-eyebrow mb-4">{legend}</legend>
      {children}
    </fieldset>
  );
}
