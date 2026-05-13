/**
 * Browser-side Google OAuth + Calendar event creation.
 *
 * Uses Google Identity Services (GIS) — the modern, PKCE-style flow Google
 * recommends for SPAs. Security comes from the origin allowlist on the OAuth
 * client (configured in Google Cloud Console), NOT from a client secret. The
 * client secret stays out of the browser entirely.
 *
 * Flow:
 *   1. Load the GIS script lazily on first use.
 *   2. `requestCalendarToken(clientId)` opens Google's consent popup and
 *      resolves with an access token scoped to `calendar.events`.
 *   3. `createCalendarEvent(token, …)` POSTs the event to the user's primary
 *      calendar, optionally with attendees + a Google Meet link. Google emails
 *      invites to attendees automatically.
 */

const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';
const CALENDAR_EVENTS_SCOPE = 'https://www.googleapis.com/auth/calendar.events';

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  scope?: string;
  error?: string;
  error_description?: string;
};

type TokenClient = {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
};

type GoogleOAuth2 = {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (r: TokenResponse) => void;
    error_callback?: (e: { type?: string; message?: string }) => void;
  }) => TokenClient;
};

declare global {
  interface Window {
    google?: { accounts?: { oauth2?: GoogleOAuth2 } };
  }
}

/* --------------------------- script loader --------------------------- */

let gisLoad: Promise<void> | null = null;

function loadGoogleIdentityServices(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('GIS is browser-only'));
  }
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (gisLoad) return gisLoad;

  gisLoad = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GIS_SCRIPT_URL}"]`,
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('Failed to load Google Identity Services')),
        { once: true },
      );
      return;
    }
    const script = document.createElement('script');
    script.src = GIS_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
  return gisLoad;
}

/* --------------------------- token request --------------------------- */

/**
 * Pops up Google's consent UI and resolves with a short-lived access token
 * scoped to creating Calendar events on the visitor's primary calendar.
 */
export async function requestCalendarToken(clientId: string): Promise<string> {
  await loadGoogleIdentityServices();
  const oauth2 = window.google?.accounts?.oauth2;
  if (!oauth2) throw new Error('Google Identity Services unavailable');

  return new Promise<string>((resolve, reject) => {
    const tokenClient = oauth2.initTokenClient({
      client_id: clientId,
      scope: CALENDAR_EVENTS_SCOPE,
      callback: (response) => {
        if (response.access_token) {
          resolve(response.access_token);
          return;
        }
        reject(
          new Error(
            response.error_description ||
              response.error ||
              'No access token returned',
          ),
        );
      },
      error_callback: (e) => {
        reject(new Error(e.message || e.type || 'OAuth flow failed'));
      },
    });

    tokenClient.requestAccessToken();
  });
}

/* --------------------------- event creation --------------------------- */

export type CalendarEventInput = {
  summary: string;
  description: string;
  start: Date;
  end: Date;
  /** Visitor's email, studio email, etc. Google emails them invites. */
  attendees: { email: string }[];
  /** When true, Calendar auto-creates a Google Meet link. */
  addMeet?: boolean;
};

export type CalendarEventResult = {
  /** Public Calendar URL for the event. */
  htmlLink?: string;
  /** Google Meet URL when `addMeet` was true. */
  hangoutLink?: string;
};

/**
 * Creates an event on the visitor's primary calendar. With `attendees`, Google
 * sends invite emails to each address (since `sendUpdates=all`). With
 * `addMeet`, a Google Meet link is auto-generated.
 */
export async function createCalendarEvent(
  token: string,
  event: CalendarEventInput,
): Promise<CalendarEventResult> {
  const params = new URLSearchParams({
    sendUpdates: 'all',
    ...(event.addMeet ? { conferenceDataVersion: '1' } : {}),
  });

  const body: Record<string, unknown> = {
    summary: event.summary,
    description: event.description,
    start: { dateTime: event.start.toISOString() },
    end: { dateTime: event.end.toISOString() },
    attendees: event.attendees,
    reminders: { useDefault: true },
  };

  if (event.addMeet) {
    body.conferenceData = {
      createRequest: {
        requestId: `crushfilms-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    };
  }

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    let detail = '';
    try {
      const errBody = await res.json();
      detail = errBody?.error?.message ?? '';
    } catch {
      // ignore body parse errors
    }
    throw new Error(
      `Calendar API ${res.status}${detail ? `: ${detail}` : ''}`,
    );
  }

  return (await res.json()) as CalendarEventResult;
}

/**
 * Read the browser-safe OAuth client id. Returns null when not configured so
 * callers can fall back to the email-only flow.
 */
export function getPublicOAuthClientId(): string | null {
  const id = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;
  return id && id.length > 0 ? id : null;
}
