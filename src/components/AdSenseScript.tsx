const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

// Plain <script>, not next/script: AdSense's site-verification crawler checks
// the raw served HTML for this literal tag. next/script's beforeInteractive
// strategy injects via a bootstrap array instead of emitting the tag as-is,
// which the crawler didn't recognize.
export default function AdSenseScript() {
  if (!ADSENSE_CLIENT_ID) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
    />
  );
}
