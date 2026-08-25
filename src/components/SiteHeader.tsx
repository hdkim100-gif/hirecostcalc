import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-xl font-medium tracking-tight text-ink"
        >
          HireCost<span className="text-money">.</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-ink-soft">
          <Link href="/#calculator" className="hover:text-ink">
            Calculator
          </Link>
          <Link href="/#hiring-budget" className="hover:text-ink hidden sm:inline">
            Hiring Budget
          </Link>
          <Link href="/employee-cost-calculator/california" className="hover:text-ink hidden sm:inline">
            By State
          </Link>
        </nav>
      </div>
    </header>
  );
}
