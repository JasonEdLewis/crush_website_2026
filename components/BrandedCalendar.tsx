'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  fetchBusyWindows,
  getPublicCalendarCreds,
  type BusyWindow,
} from '@/lib/googleCalendar';

/* ----------------------------- config ----------------------------- */

const SLOT_MINUTES = 30;
const WORKDAY_START_HOUR = 9;  // first slot starts at 9:00
const WORKDAY_END_HOUR = 17;   // last slot ENDS at 17:00 (i.e. starts 16:30)
const WORKDAYS_TO_SHOW = 10;   // ~2 weeks of weekdays

/* ----------------------------- types ----------------------------- */

type Slot = { start: Date; end: Date; busy: boolean };

/* --------------------------- date helpers ------------------------- */

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function generateUpcomingWorkdays(count: number): Date[] {
  const days: Date[] = [];
  const cursor = startOfDay(new Date());
  cursor.setDate(cursor.getDate() + 1); // start tomorrow
  while (days.length < count) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function generateSlotsForDay(day: Date, busyWindows: BusyWindow[]): Slot[] {
  const slots: Slot[] = [];
  for (let h = WORKDAY_START_HOUR; h < WORKDAY_END_HOUR; h++) {
    for (const m of [0, SLOT_MINUTES]) {
      if (m >= 60) continue;
      const start = new Date(day);
      start.setHours(h, m, 0, 0);
      const end = new Date(start.getTime() + SLOT_MINUTES * 60_000);
      const busy = busyWindows.some((w) => w.start < end && w.end > start);
      slots.push({ start, end, busy });
    }
  }
  return slots;
}

function formatDayLong(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function formatDayShort(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase();
}

function formatDayNumber(d: Date): string {
  return String(d.getDate());
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function localTimezoneLabel(): string {
  try {
    return (
      new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
        .formatToParts(new Date())
        .find((p) => p.type === 'timeZoneName')?.value ?? ''
    );
  } catch {
    return '';
  }
}

/* ----------------------------- component ----------------------------- */

/**
 * Branded availability picker. Designed to live INSIDE the inquiry form —
 * the selected slot is exposed via `<input type="hidden">` fields that the
 * surrounding `<form>` submits along with the rest of the brief.
 *
 *  - Uses `freeBusy.query` to dim unavailable slots when public Google
 *    Calendar creds are set (NEXT_PUBLIC_GOOGLE_CALENDAR_*).
 *  - Falls back to showing all slots when creds are missing or the request
 *    fails — the team confirms manually via the email pipeline either way.
 */
export default function BrandedCalendar({
  onSelect,
}: {
  /** Fires whenever the picked slot changes (null when cleared). Lets the
   *  parent form know whether to branch into the OAuth booking flow. */
  onSelect?: (slot: { start: Date; end: Date } | null) => void;
} = {}) {
  const upcomingDays = useMemo(() => generateUpcomingWorkdays(WORKDAYS_TO_SHOW), []);
  const [selectedDay, setSelectedDay] = useState<Date>(upcomingDays[0]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [busyWindows, setBusyWindows] = useState<BusyWindow[]>([]);
  const [liveAvailability, setLiveAvailability] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tz, setTz] = useState('');

  // Notify the parent whenever the picked slot changes.
  useEffect(() => {
    onSelect?.(selectedSlot ? { start: selectedSlot.start, end: selectedSlot.end } : null);
  }, [selectedSlot, onSelect]);

  // Set the timezone label after mount to avoid SSR/CSR drift.
  useEffect(() => setTz(localTimezoneLabel()), []);

  // Pull live availability when public creds are present.
  useEffect(() => {
    const creds = getPublicCalendarCreds();
    if (!creds) return;

    const controller = new AbortController();
    const timeMin = upcomingDays[0];
    const timeMax = new Date(upcomingDays[upcomingDays.length - 1]);
    timeMax.setHours(23, 59, 59, 999);

    setLoading(true);
    fetchBusyWindows(creds.apiKey, creds.calendarId, timeMin, timeMax, controller.signal)
      .then((windows) => {
        if (windows === null) return;
        setBusyWindows(windows);
        setLiveAvailability(true);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [upcomingDays]);

  // Clear the picked slot if it no longer belongs to the selected day.
  useEffect(() => {
    if (!selectedSlot) return;
    if (selectedSlot.start.toDateString() !== selectedDay.toDateString()) {
      setSelectedSlot(null);
    }
  }, [selectedDay, selectedSlot]);

  const slots = useMemo(
    () => generateSlotsForDay(selectedDay, busyWindows),
    [selectedDay, busyWindows],
  );

  const slotHumanLabel = selectedSlot
    ? `${formatDayLong(selectedSlot.start)} · ${formatTime(selectedSlot.start)}–${formatTime(selectedSlot.end)}${tz ? ' ' + tz : ''}`
    : '';

  return (
    <div className="relative rounded-2xl border border-white/10 bg-ink-950/40 overflow-hidden">
      {/* subtle crush-tinted glow up top */}
      <div
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-crush-500/10 to-transparent pointer-events-none"
        aria-hidden
      />

      {/* hidden inputs — only present when a slot is picked, so the slot
          is optional from the form's perspective. Carried by the parent <form>. */}
      {selectedSlot && (
        <>
          <input type="hidden" name="requested_slot" value={slotHumanLabel} />
          <input
            type="hidden"
            name="requested_slot_iso"
            value={selectedSlot.start.toISOString()}
          />
        </>
      )}

      {/* header — status pill + timezone */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 px-6 md:px-8 pt-6 md:pt-7 pb-3">
        <span
          className={
            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] border ' +
            (liveAvailability
              ? 'bg-crush-500/10 text-crush-500 border-crush-500/30'
              : 'bg-white/[0.04] text-ink-300 border-white/10')
          }
        >
          <span
            aria-hidden
            className={
              'inline-block h-1.5 w-1.5 rounded-full ' +
              (liveAvailability ? 'bg-crush-500 animate-pulse' : 'bg-ink-400')
            }
          />
          {loading
            ? 'Checking availability…'
            : liveAvailability
              ? 'Live availability'
              : 'Tentative times'}
        </span>
        {tz && (
          <span className="text-xs text-ink-500">
            Times in <span className="text-ink-200">{tz}</span>
          </span>
        )}
      </div>

      {/* selected-slot summary chip (sits between header and day strip) */}
      {selectedSlot && (
        <div className="relative mx-6 md:mx-8 mb-2 mt-1 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-crush-500/30 bg-crush-500/[0.06] px-4 py-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="h-eyebrow text-crush-500">Picked</span>
            <span className="font-display text-base md:text-lg tracking-tightest text-ink-50">
              {formatDayLong(selectedSlot.start)}
            </span>
            <span className="text-ink-400">·</span>
            <span className="font-display text-base md:text-lg tracking-tightest text-ink-50 tabular-nums">
              {formatTime(selectedSlot.start)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedSlot(null)}
            className="text-xs text-ink-300 hover:text-ink-50 transition-colors link-underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* day strip */}
      <div
        className="relative px-6 md:px-8 pb-2 overflow-x-auto"
        role="tablist"
        aria-label="Pick a day"
      >
        <div className="flex gap-2 min-w-max py-2">
          {upcomingDays.map((day) => {
            const isSelected = day.toDateString() === selectedDay.toDateString();
            return (
              <button
                key={day.toISOString()}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedDay(day)}
                className={
                  'group flex flex-col items-center gap-0.5 rounded-xl px-4 py-3 text-center transition-all duration-300 border ' +
                  (isSelected
                    ? 'bg-crush-500 text-ink-950 border-crush-500'
                    : 'bg-white/[0.02] text-ink-200 border-white/10 hover:border-white/30 hover:bg-white/[0.04]')
                }
              >
                <span
                  className={
                    'text-[10px] font-medium uppercase tracking-[0.08em] ' +
                    (isSelected ? 'text-ink-950/70' : 'text-ink-500 group-hover:text-ink-300')
                  }
                >
                  {formatDayShort(day)}
                </span>
                <span className="font-display text-2xl tracking-tightest">
                  {formatDayNumber(day)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* time grid */}
      <div className="relative px-6 md:px-8 pt-2 pb-6 md:pb-8">
        <p className="h-eyebrow mb-4">
          Available on{' '}
          <span className="text-ink-100">{formatDayLong(selectedDay)}</span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {slots.map((slot) => {
            const isSelected =
              selectedSlot?.start.getTime() === slot.start.getTime();
            const disabled = slot.busy;
            return (
              <button
                key={slot.start.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedSlot(slot)}
                aria-pressed={isSelected}
                className={
                  'rounded-lg px-3 py-2.5 text-sm tabular-nums transition-all duration-300 border ' +
                  (disabled
                    ? 'border-white/5 bg-white/[0.01] text-ink-600 line-through cursor-not-allowed'
                    : isSelected
                      ? 'border-crush-500 bg-crush-500 text-ink-950 font-medium'
                      : 'border-white/10 bg-white/[0.02] text-ink-100 hover:border-white/30 hover:bg-white/[0.04]')
                }
              >
                {formatTime(slot.start)}
              </button>
            );
          })}
        </div>

        {slots.every((s) => s.busy) && (
          <p className="mt-4 text-sm text-ink-400">
            Nothing open this day — try another date above.
          </p>
        )}
      </div>

      {/* offline / fallback note */}
      {!liveAvailability && !loading && (
        <div className="relative border-t border-white/5 px-6 md:px-8 py-3 text-[11px] text-ink-500">
          Availability shown without live calendar sync — we&rsquo;ll confirm
          your time by email within two business days.
        </div>
      )}
    </div>
  );
}
