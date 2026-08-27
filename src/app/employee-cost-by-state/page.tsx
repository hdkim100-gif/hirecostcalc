import type { Metadata } from "next";
import Link from "next/link";
import { STATE_LIST, TAX_YEAR } from "@/lib/tax-engine";
import { calculate, EMPTY_BENEFITS } from "@/lib/calculate";
import { formatCurrency } from "@/lib/format";
import { slugify } from "@/lib/state-content";

export const metadata: Metadata = {
  title: `Employee Cost by State ${TAX_YEAR}`,
  description:
    "The fully-loaded mandatory cost of a $60,000 employee in every US state for 2026 — employer payroll taxes, state unemployment insurance, and the true cost multiplier, ranked highest to lowest.",
  alternates: { canonical: "/employee-cost-by-state" },
};

const EXAMPLE_SALARY = 60000;

function rowFor(code: string) {
  const r = calculate({
    annualSalary: EXAMPLE_SALARY,
    stateCode: code,
    currentHeadcount: 0,
    includeBenefits: false,
    benefits: EMPTY_BENEFITS,
  });
  return {
    code,
    name: r.stateName,
    slug: slugify(r.stateName),
    mandatory: r.mandatoryAnnualPerEmployee,
    total: r.totalAnnualPerEmployee,
    multiplier: r.multiplierOfSalary,
  };
}

export default function EmployeeCostByStatePage() {
  const rows = STATE_LIST.map((s) => rowFor(s.code)).sort(
    (a, b) => b.total - a.total
  );
  const highest = rows.slice(0, 5);
  const lowest = [...rows].slice(-5).reverse();

  return (
    <section className="mx-auto max-w-5xl px-6 pt-16 pb-24 sm:pt-24">
      <p className="text-xs uppercase tracking-widest text-cost">
        50-state data &middot; {TAX_YEAR}
      </p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
        Employee cost by state, {TAX_YEAR}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
        A {formatCurrency(EXAMPLE_SALARY)} salary doesn&rsquo;t cost an
        employer the same amount everywhere. State unemployment insurance
        (SUI) rates and wage bases differ, and a few states carry a federal
        FUTA credit-reduction add-on. Below is the fully-loaded mandatory
        cost &mdash; salary plus employer payroll taxes, no optional
        benefits &mdash; for a new employer hiring one {formatCurrency(EXAMPLE_SALARY)}{" "}
        employee in every state.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div className="rounded-sm border border-hairline bg-paper-raised p-6">
          <h2 className="font-display text-lg text-ink">
            Highest mandatory cost
          </h2>
          <ol className="mt-4 space-y-2.5 text-sm">
            {highest.map((r, i) => (
              <li key={r.code} className="flex items-baseline justify-between gap-3">
                <span className="text-ink-soft">
                  {i + 1}.{" "}
                  <Link
                    href={`/employee-cost-calculator/${r.slug}`}
                    className="text-ink hover:underline"
                  >
                    {r.name}
                  </Link>
                </span>
                <span className="font-mono text-ink">
                  {formatCurrency(r.total)}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-sm border border-hairline bg-paper-raised p-6">
          <h2 className="font-display text-lg text-ink">
            Lowest mandatory cost
          </h2>
          <ol className="mt-4 space-y-2.5 text-sm">
            {lowest.map((r, i) => (
              <li key={r.code} className="flex items-baseline justify-between gap-3">
                <span className="text-ink-soft">
                  {i + 1}.{" "}
                  <Link
                    href={`/employee-cost-calculator/${r.slug}`}
                    className="text-ink hover:underline"
                  >
                    {r.name}
                  </Link>
                </span>
                <span className="font-mono text-ink">
                  {formatCurrency(r.total)}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-hairline text-left text-xs uppercase tracking-wide text-ink-faint">
              <th className="py-3 pr-4 font-normal">State</th>
              <th className="py-3 pr-4 font-normal text-right">Salary</th>
              <th className="py-3 pr-4 font-normal text-right">
                Employer taxes
              </th>
              <th className="py-3 pr-4 font-normal text-right">True cost</th>
              <th className="py-3 font-normal text-right">Multiplier</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code} className="border-b border-hairline-soft">
                <td className="py-2.5 pr-4 text-ink">
                  <Link
                    href={`/employee-cost-calculator/${r.slug}`}
                    className="hover:underline"
                  >
                    {r.name}
                  </Link>
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-ink-soft">
                  {formatCurrency(EXAMPLE_SALARY)}
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-ink-soft">
                  {formatCurrency(r.mandatory)}
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-money">
                  {formatCurrency(r.total)}
                </td>
                <td className="py-2.5 text-right font-mono text-ink-soft">
                  {r.multiplier.toFixed(2)}x
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 max-w-2xl space-y-3 text-sm leading-relaxed text-ink-faint">
        <p>
          Assumes a new employer (not yet experience-rated for unemployment
          insurance) and no optional benefits. States with a projected
          federal FUTA credit-reduction add-on for {TAX_YEAR} carry a higher
          effective FUTA rate until the U.S. Department of Labor finalizes
          its list, typically after November 10 &mdash; see{" "}
          <Link href="/methodology" className="text-money underline decoration-hairline underline-offset-2 hover:decoration-money">
            Methodology
          </Link>{" "}
          for sources and the full calculation.
        </p>
        <p>
          Want a different salary, headcount, or your own benefits? Use the{" "}
          <Link href="/#calculator" className="text-money underline decoration-hairline underline-offset-2 hover:decoration-money">
            full calculator
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
