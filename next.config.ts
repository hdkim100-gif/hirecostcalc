import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Static export for Cloudflare Pages (or any static host) — this site has
   * no server-only features (no API routes, no dynamic SSR, no next/image),
   * so a full static build works cleanly. Produces the `out/` folder. */
  output: "export",
};

export default nextConfig;
