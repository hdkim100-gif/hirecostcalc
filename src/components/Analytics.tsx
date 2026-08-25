"use client";

import Script from "next/script";
import { useConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function Analytics() {
  const consent = useConsent();

  if (!GA_ID || consent !== "granted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
