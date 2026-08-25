"use client";

import { useSyncExternalStore } from "react";

export const CONSENT_KEY = "hirecost-consent";
export const CONSENT_EVENT = "hirecost-consent-changed";

export type ConsentValue = "granted" | "denied";

export function setConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // localStorage unavailable (private browsing, etc.) — the choice just
    // won't persist across visits, which is a safe (more private) fallback.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): ConsentValue | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function getServerSnapshot(): ConsentValue | null {
  return null;
}

/** Reads the visitor's cookie-consent choice, staying in sync across tabs. */
export function useConsent(): ConsentValue | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
