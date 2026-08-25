# HireCost

Small business hiring cost calculator for the US market — what a salary
actually costs an employer once payroll taxes and benefits are added in.
Next.js (App Router) + TypeScript + Tailwind v4.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `src/lib/tax-engine/` — tax data, isolated from the UI. `federal/2026.ts`
  holds Social Security, Medicare, and FUTA parameters; `states/<CODE>/2026.ts`
  holds each state's SUI rate/wage base and FUTA credit reduction add-on.
- `src/lib/calculate.ts` — pure calculation functions (`calculate`,
  `solveAffordableSalary`). No UI or React imports, so the same logic can be
  reused by a future mobile app.
- `src/lib/benefit-defaults.ts` — illustrative national-average defaults for
  health insurance (KFF survey) and workers' comp (rough NCCI-class-code
  buckets by industry). Unlike the tax engine, these are market prices, not
  statutes — there's no authoritative single source, so they're clearly
  labeled as rough and always editable.
- `src/components/Calculator.tsx` — the interactive widget: the new hire's
  salary, state, current headcount (used only for threshold checks, not as a
  cost multiplier), optional benefits, and the hiring-budget reverse
  calculator.
- `src/app/employee-cost-calculator/[state]/` — statically generated SEO
  pages for all 50 states. California/Texas/Florida/New York have
  hand-researched narrative content in `src/lib/state-content.ts`; the other
  46 get an auto-generated page built from their tax-engine data (accurate,
  less bespoke prose).

All 50 states are supported for the calculator itself. Add a new state's
data in `states/<CODE>/2026.ts` (or add an entry to `other-2026.ts`) and
register it in `tax-engine/index.ts`; its SEO page is generated
automatically. To give a state the richer hand-written treatment instead,
add an entry to `STATE_CONTENT` in `state-content.ts`.

### The "current headcount" input

This is deliberately not a cost multiplier. It only affects two things: which
paid-sick-leave tier applies (e.g. New York's 40-vs-56-hour split at 100
employees) and whether the ACA's 50-employee note shows up. Every dollar
figure in the receipt is the fully-loaded cost of the *one* new hire being
priced — not a team total, since that would require guessing every existing
employee's salary.

### Paid sick leave

Modeled for California (flat 40 hrs/yr) and New York (40 or 56 hrs/yr,
tiered by headcount) — both state-level, both converted to a dollar figure
via salary ÷ 2080 hours × the annual cap. It's shown as a **separate
"Paid Sick Leave Requirement" info box, not summed into True Annual Cost**:
for a salaried employee it's already covered by their fixed salary (they're
paid whether they're at their desk or out sick), so adding it on top would
double-count it. Roughly 15 other states have their own paid sick/paid leave laws
(AZ, CO, CT, IL, ME, MD, MA, MI, MN, NV, NJ, NM, OR, RI, VT, WA) that aren't
modeled yet — `paidSickLeave` is `undefined` for those states today, not a
claim that no such law exists. City-level ordinances (NYC, SF, Seattle,
etc., which can be stricter than their state floor) aren't modeled at all.

## Annual tax data update checklist

Rates here are current for tax year 2026 as of Jan 2026. Before rolling the
calculator to a new tax year:

1. **Social Security wage base** — SSA announces in October for the
   following year.
2. **FUTA credit reduction states** — the US Department of Labor publishes
   its determination in November. States with an unpaid federal UI loan
   balance (check the Federal Register notice) get a `futaCreditReduction`
   entry; states that repaid their loan should have it removed or zeroed.
3. **State SUI new-employer rate and wage base** — set by each state's labor
   department, typically effective January 1. 19 states are individually
   verified against their own agency: California, Texas, Florida, New York
   (own files, EDD/TWC/DOR/NY DOL) plus Arizona, Georgia, Illinois, Indiana,
   Massachusetts, Maryland, Michigan, Missouri, North Carolina, New Jersey,
   Ohio, Pennsylvania, Tennessee, Virginia, and Washington (in
   `other-2026.ts`, chosen as the next tier by population/business density
   after the original 4 — each has a real agency name in `sui.source`). The
   remaining 31 states are still compiled from multi-state payroll
   compliance roundups and not individually verified (`sui.source` is unset
   for those, falling back to a generic "not yet verified" label in
   `state()`) — treat those as a good starting point to confirm before
   relying on for a specific business, especially for states flagged with a
   "rough placeholder" note (several assign new-employer rates by industry
   average rather than one flat number). Prioritize verifying the rest by
   actual state-page traffic once the site has real visitors, rather than
   guessing which states matter most.
4. Add a new `<year>.ts` file per state/federal rather than editing the
   previous year's in place, so old tax years stay reproducible.

## Running it locally without the command line

Double-click `run-local-demo.bat`. It builds the static export (`out/`) and
serves it at [http://localhost:3000](http://localhost:3000) via `serve`,
opening your default browser automatically — the same static files that get
uploaded to Cloudflare Pages. Close the "HireCost local server" window it
opens to stop it.

## Deploying (Cloudflare Pages)

This site has no server-only features (no API routes, no dynamic SSR, no
`next/image`), so it builds as a fully static export via `output: "export"`
in `next.config.ts` — `npm run build` produces the `out/` folder, which is
what gets deployed, not the source tree.

1. Push this repo to GitHub (`git remote add origin <your-repo-url>`, then
   `git push -u origin main`).
2. In the Cloudflare dashboard: Workers & Pages → Create → Pages → Connect
   to Git → pick the repo.
3. Build settings: build command `npm run build`, output directory `out`.
4. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_ADSENSE_CLIENT_ID` as
   environment variables in the Pages project settings if you want them live
   (they're baked in at build time, so a local `.env.local` alone doesn't
   reach the deployed build).
5. Custom domain: Pages project → Custom domains → Add a domain. If the
   domain isn't already on your Cloudflare account, add it there first
   (Websites → Add a site) and point its registrar's nameservers at the ones
   Cloudflare gives you.
6. Once a real domain is attached, replace every `hirecost.example.com`
   placeholder (layout metadata, `public/ads.txt`, About/Privacy/Terms) with
   it.

## Analytics and ads

Both are opt-in via environment variables — the site works fully with
neither set.

1. Copy `.env.example` to `.env.local`.
2. Fill in `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Google Analytics 4, format
   `G-XXXXXXXXXX`) and/or `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (AdSense, format
   `ca-pub-XXXXXXXXXXXXXXXX`) once you have them.
3. Rebuild (`npm run build`) — these are baked in at build time.

The Analytics script (`src/components/Analytics.tsx`) only fires after a
visitor accepts the cookie banner (`src/components/ConsentBanner.tsx`);
declining or ignoring the banner keeps it off. The AdSense loader
(`src/components/AdSenseScript.tsx`) loads whenever the client ID is set,
matching Google's own setup instructions — it's the base script Google's
review crawler and site-ownership verification look for.

Before you actually apply to AdSense, replace every `hirecost.example.com`
placeholder (in `layout.tsx` metadata, `public/ads.txt`, and the About/
Privacy/Terms pages) with your real domain, put a real contact address in
place of `hello@hirecost.example.com`, and fill in your real publisher ID in
`public/ads.txt`. AdSense review also expects: a live custom domain (not a
preview/staging URL), the site fully navigable (About/Privacy/Terms are
already wired into the footer), and no placeholder/lorem-ipsum content —
this repo's state pages and FAQ are real, but re-read them once populated
with your final domain and rates for the current tax year. Applying itself
happens at [google.com/adsense](https://www.google.com/adsense/) with your
Google account — that step isn't something to automate.

## What this MVP intentionally leaves out

PTO/paid-holiday cost estimation (discretionary, not legally mandated, and
mostly an opportunity cost rather than an added cash cost for salaried
employees — a fundamentally different kind of number than the additive
tax/benefit lines here), a real per-class-code workers' comp calculation
(NCCI rate data is commercially licensed, not public), employee-vs-contractor
comparison, city-level tax/sick-leave ordinances, and accounts/saved
calculations. Workers' comp defaults to a rough industry-average rate but
always accepts your own quoted annual premium instead.
