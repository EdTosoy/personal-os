'use client';

import { useEffect } from 'react';

const HEALTH_URL = 'https://pixshare-api-edtosoy.onrender.com/health';
const STORAGE_KEY = 'pixshare:last-prewarm-at';
const COOLDOWN_MS = 10 * 60 * 1000;
let lastAttemptAt: number | undefined;

export default function PixSharePrewarm() {
  useEffect(() => {
    const now = Date.now();
    let previous = lastAttemptAt;

    try {
      const stored = Number(window.sessionStorage.getItem(STORAGE_KEY));
      if (Number.isFinite(stored) && stored > 0 && stored <= now) {
        previous = Math.max(previous ?? 0, stored);
      }
    } catch {
      // Storage may be blocked; the module timestamp still deduplicates mounts.
    }

    if (
      previous !== undefined &&
      now >= previous &&
      now - previous < COOLDOWN_MS
    ) {
      return;
    }

    // Record the attempt before fetching, including failures and Strict Mode replays.
    lastAttemptAt = now;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, String(now));
    } catch {
      // Keep prewarming best-effort when session storage is unavailable.
    }

    try {
      // No CORS permission is needed: the opaque response is deliberately ignored.
      // Do not abort on cleanup: Strict Mode and navigation must not cancel the wakeup.
      void fetch(HEALTH_URL, {
        method: 'GET',
        mode: 'no-cors',
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        keepalive: true,
      }).catch(() => undefined);
    } catch {
      // Missing or synchronously failing fetch must never affect the portfolio.
    }
  }, []);

  return null;
}
