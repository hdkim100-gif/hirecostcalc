"use client";

import Link from "next/link";
import { setConsent, useConsent } from "@/lib/consent";

export default function ConsentBanner() {
  const consent = useConsent();

  if (consent !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-paper-raised px-5 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-xs leading-relaxed text-ink-soft">
          We use cookies for site analytics and to show ads. The calculator
          itself never sends your numbers anywhere.{" "}
          <Link
            href="/privacy"
            className="text-ink underline decoration-hairline underline-offset-2 hover:decoration-money"
          >
            Privacy Policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent("denied")}
            className="border border-hairline px-4 py-2 text-xs text-ink-soft hover:border-ink hover:text-ink"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => setConsent("granted")}
            className="bg-ink px-4 py-2 text-xs text-paper-raised hover:bg-money"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
