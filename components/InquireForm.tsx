'use client';

import { useCallback, useState, type FormEvent } from 'react';
import BrandedCalendar from '@/components/BrandedCalendar';
import {
  SITE,
  FAITH_INTAKE_COMMON_FIELDS,
  type FaithPackage,
  type FaithPackageField,
} from '@/lib/content';
import {
  createCalendarEvent,
  getPublicOAuthClientId,
  requestCalendarToken,
} from '@/lib/googleOAuth';

/**
 * The tailored inquiry form for /faith/inquire/<slug>/.
 *
 * Submit behavior:
 *  - No slot picked → form posts to /contact.php normally (email pipeline).
 *  - Slot picked + OAuth client configured → on submit we open Google's
 *    consent popup (Identity Services token flow, no client secret), create
 *    the event on the visitor's primary calendar with the studio as invitee
 *    + a Google Meet link, then let the form continue to /contact.php for
 *    the email record-of-truth. If OAuth fails or is declined, the form
 *    still submits so the brief gets through.
 */
export default function InquireForm({ pkg }: { pkg: FaithPackage }) {
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingNotice, setBookingNotice] = useState<string | null>(null);

  // Memoize so BrandedCalendar's useEffect dep doesn't fire every render.
  const handleSlot = useCallback(
    (slot: { start: Date; end: Date } | null) => {
      setSelectedSlot(slot);
      setBookingError(null);
      setBookingNotice(null);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      const form = e.currentTarget;
      const clientId = getPublicOAuthClientId();

      // No slot or no OAuth configured → fall through to the native form post.
      if (!selectedSlot || !clientId) return;

      e.preventDefault();
      setSubmitting(true);
      setBookingError(null);
      setBookingNotice(null);

      const elements = form.elements;
      const visitorName =
        (elements.namedItem('name') as HTMLInputElement | null)?.value ?? '';
      const visitorEmail =
        (elements.namedItem('email') as HTMLInputElement | null)?.value ?? '';
      const briefVal =
        (elements.namedItem('brief') as HTMLTextAreaElement | null)?.value ?? '';

      try {
        const token = await requestCalendarToken(clientId);
        const result = await createCalendarEvent(token, {
          summary: `Crushfilms × ${pkg.title} — intro call${visitorName ? ' with ' + visitorName : ''}`,
          description:
            `Intro call about ${pkg.title} (${pkg.price} ${pkg.cadence}).\n\n` +
            (visitorEmail ? `From: ${visitorName || 'Visitor'} <${visitorEmail}>\n\n` : '') +
            (briefVal ? `Brief:\n${briefVal}\n\n` : '') +
            `Booked via merrickrobertmedia.com`,
          start: selectedSlot.start,
          end: selectedSlot.end,
          attendees: [
            ...(visitorEmail ? [{ email: visitorEmail }] : []),
            { email: SITE.email },
          ],
          addMeet: true,
        });

        setBookingNotice(
          result.hangoutLink
            ? `Calendar invite + Meet link sent. We'll be in touch.`
            : `Calendar invite sent. We'll be in touch.`,
        );
        // Continue to email pipeline so the brief is recorded.
        form.submit();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Booking failed';
        setBookingError(
          `Couldn't reach Google Calendar (${msg}). Your brief will still be sent.`,
        );
        setSubmitting(false);
        // Submit the form anyway so the visitor isn't stuck.
        form.submit();
      }
    },
    [pkg, selectedSlot],
  );

  return (
    <form
      action="/contact.php"
      method="post"
      onSubmit={handleSubmit}
      className="space-y-10"
    >
      {/* honeypot */}
      <div
        aria-hidden
        className="hidden"
        style={{ position: 'absolute', left: '-9999px' }}
      >
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* hidden context — surfaces in the email body via contact.php */}
      <input type="hidden" name="package" value={pkg.title} />
      <input type="hidden" name="package_slug" value={pkg.slug} />
      <input
        type="hidden"
        name="package_price"
        value={`${pkg.price} ${pkg.cadence}`}
      />

      <FieldGroup legend="Who we'll be talking to">
        {FAITH_INTAKE_COMMON_FIELDS.map((f) => (
          <FormField key={f.name} field={f} />
        ))}
      </FieldGroup>

      <FieldGroup legend={`About ${pkg.title}`}>
        {pkg.intake.fields.map((f) => (
          <FormField key={f.name} field={f} />
        ))}
      </FieldGroup>

      <fieldset>
        <legend className="h-eyebrow mb-2">Pick a time (optional)</legend>
        <p className="text-sm text-ink-400 mb-5 max-w-xl leading-relaxed">
          Got a moment that works for you already? Pick a slot — we&rsquo;ll
          send a Google Calendar invite (with Meet link) as soon as you
          submit. Skip this and we&rsquo;ll propose times when we reply.
        </p>
        <BrandedCalendar onSelect={handleSlot} />
      </fieldset>

      <FieldGroup legend="Anything else we should know?">
        <FormField
          field={{
            name: 'brief',
            label: 'In your own words',
            type: 'textarea',
            rows: 5,
            required: true,
            placeholder:
              'Even a sentence is plenty — we’ll come back with questions.',
          }}
        />
      </FieldGroup>

      <div className="pt-4 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting
            ? 'Booking…'
            : selectedSlot
              ? 'Confirm with Google & send →'
              : 'Send inquiry →'}
        </button>
        <p className="text-xs text-ink-500">
          {selectedSlot
            ? 'Google will ask you to sign in to add the event to your calendar.'
            : 'We typically reply within two business days.'}
        </p>
      </div>

      {bookingNotice && (
        <p className="text-sm text-crush-500 leading-snug">{bookingNotice}</p>
      )}
      {bookingError && (
        <p className="text-sm text-ink-300 leading-snug">{bookingError}</p>
      )}
    </form>
  );
}

/* --------------------------- form primitives --------------------------- */

function FieldGroup({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-8">
      <legend className="h-eyebrow mb-2">{legend}</legend>
      {children}
    </fieldset>
  );
}

function FormField({ field }: { field: FaithPackageField }) {
  const required = field.required ?? false;
  const type = field.type ?? 'text';

  return (
    <label className="block">
      <span className="h-eyebrow block mb-3">
        {field.label}
        {required && ' *'}
      </span>
      {type === 'textarea' ? (
        <textarea
          name={field.name}
          rows={field.rows ?? 4}
          required={required}
          placeholder={field.placeholder}
          className="w-full bg-transparent border-b border-white/15 focus:border-ink-50 outline-none py-3 text-ink-50 placeholder-ink-500 transition-colors duration-300 resize-none"
        />
      ) : (
        <input
          type={type}
          name={field.name}
          required={required}
          placeholder={field.placeholder}
          className="w-full bg-transparent border-b border-white/15 focus:border-ink-50 outline-none py-3 text-ink-50 placeholder-ink-500 transition-colors duration-300"
        />
      )}
    </label>
  );
}
