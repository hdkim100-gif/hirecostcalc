import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-hairline pb-16 lg:pb-0">
      <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-ink-soft">
        <p className="max-w-2xl leading-relaxed">
          Estimates are for informational purposes only and may differ from
          actual payroll. Tax rates, employee elections, benefits, local
          taxes, and employer-specific experience rates can affect actual
          results. HireCost does not provide tax, payroll, legal, or
          accounting advice.
        </p>
        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-tabular text-xs uppercase tracking-wide text-ink-faint">
          <span>No sign-up</span>
          <span aria-hidden>·</span>
          <span>No salary data stored</span>
          <span aria-hidden>·</span>
          <span>Calculations run on your device</span>
          <span aria-hidden>·</span>
          <span>2026 tax year</span>
        </p>
        <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-1 border-t border-hairline-soft pt-5 text-xs text-ink-faint">
          <Link href="/about" className="hover:text-ink">
            About
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
