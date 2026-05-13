/**
 * Tiny client-side wrapper around the Google Calendar v3 `freeBusy.query`
 * endpoint. Used by the BrandedCalendar component to render real-time
 * availability when an API key is configured.
 *
 * Static-export reminder: this runs in the browser, so only public env vars
 * (NEXT_PUBLIC_*) are visible. Restrict the API key in the Google Cloud
 * Console to your production domains + the Calendar API only.
 */

export type BusyWindow = { start: Date; end: Date };

type FreeBusyResponse = {
  calendars?: Record<string, { busy?: { start: string; end: string }[] }>;
  error?: { code: number; message: string };
};

/**
 * Returns the busy windows on `calendarId` between `timeMin` and `timeMax`.
 * Resolves to `null` on transport failure — callers should treat that as
 * "availability unknown, show all slots" rather than throwing.
 */
export async function fetchBusyWindows(
  apiKey: string,
  calendarId: string,
  timeMin: Date,
  timeMax: Date,
  signal?: AbortSignal,
): Promise<BusyWindow[] | null> {
  const url = `https://www.googleapis.com/calendar/v3/freeBusy?key=${encodeURIComponent(apiKey)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        items: [{ id: calendarId }],
      }),
      signal,
    });
  } catch {
    return null;
  }

  if (!res.ok) return null;

  let data: FreeBusyResponse;
  try {
    data = (await res.json()) as FreeBusyResponse;
  } catch {
    return null;
  }

  if (data.error) return null;

  const cal = data.calendars?.[calendarId];
  if (!cal?.busy) return [];

  return cal.busy.map((w) => ({
    start: new Date(w.start),
    end: new Date(w.end),
  }));
}

/**
 * Read the public Google Calendar env vars. Returns null when either is
 * missing so callers can fall back to "static slots" mode.
 */
export function getPublicCalendarCreds():
  | { apiKey: string; calendarId: string }
  | null {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY;
  const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
  if (!apiKey || !calendarId) return null;
  return { apiKey, calendarId };
}
