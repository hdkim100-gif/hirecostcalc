import type { Metadata } from "next";
import Link from "next/link";
import { STATE_LIST, TAX_YEAR } from "@/lib/tax-engine";
import { calculate, EMPTY_BENEFITS } from "@/lib/calculate";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: `Salary vs. True Employer Cost ${TAX_YEAR}`,
  description:
    "How the true cost multiplier changes as salary rises: a national-average breakdown of mandatory employer payroll taxes at each salary band for 2026.",
  alternates: { canonical: "/salary-vs-employer-cost" },
};

const SALARY_BANDS = [40000, 60000, 80000, 100000, 120000, 150000, 200000];

function nationalAverageAt(salary: number) {
  const totals = STATE_LIST.map(
    (s) =>
      calculate({
        annualSalary: salary,
        stateCode: s.code,
        currentHeadcount: 0,
        includeBenefits: false,
        benefits: EMPTY_BENEFITS,
      }).mandatoryAnnualPerEmployee
  );
  const avgMandatory = totals.reduce((a, b) => a + b, 0) / totals.length;
  const trueCost = salary + avgMandatory;
  return { salary, avgMandatory, trueCost, multiplier: trueCost / salary };
}

export default function SalaryVsEmployerCostPage() {
  const rows = SALARY_BANDS.map(nationalAverageAt);
  const first = rows[0];
  const last = rows[rows.length - 1];

  return (
    <section className="mx-auto max-w-5xl px-6 pt-16 pb-24 sm:pt-24">
      <p className="text-xs uppercase tracking-widest text-cost">
        National average &middot; {TAX_YEAR}
      </p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
        Salary vs. true employer cost, {TAX_YEAR}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
        Mandatory employer payroll taxes don&rsquo;t scale linearly with
        salary. Social Security, FUTA, and most states&rsquo; SUI only apply
        up to a wage base &mdash; so as salary rises past those caps, the
        added tax stops growing and the cost multiplier shrinks. Below is
        the national-average mandatory cost (averaged across all 50 states&rsquo;
        {" "}{TAX_YEAR} new-employer rates, no optional benefits) at each
        salary level.
      </p>

      <div className="mt-8 max-w-xl rounded-sm border border-hairline bg-paper-raised p-6 text-sm leading-relaxed text-ink-soft">
        At {formatCurrency(first.salary)}, mandatory employer taxes add about{" "}
        <span className="font-mono text-ink">
          {first.multiplier.toFixed(2)}x
        </span>{" "}
        salary on average nationally. By {formatCurrency(last.salary)}, wage-base
        caps bring that down to about{" "}
        <span className="font-mono text-ink">
          {last.multiplier.toFixed(2)}x
        </span>
        &nbsp;&mdash; the dollar amount of mandatory tax keeps rising, but
        slower than salary does.
      </div>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-hairline text-left text-xs uppercase tracking-wide text-ink-faint">
              <th className="py-3 pr-4 font-normal">Salary</th>
              <th className="py-3 pr-4 font-normal text-right">
                Avg. mandatory taxes
              </th>
              <th className="py-3 pr-4 font-normal text-right">
                Est. true cost
              </th>
              <th className="py-3 font-normal text-right">Multiplier</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.salary} className="border-b border-hairline-soft">
                <td className="py-2.5 pr-4 font-mono text-ink">
                  {formatCurrency(r.salary)}
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-ink-soft">
                  {formatCurrency(r.avgMandatory)}
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-money">
                  {formatCurrency(r.trueCost)}
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
          These are national averages across all 50 states&rsquo; new-employer
          rates &mdash; your actual state will be higher or lower. See{" "}
          <Link
            href="/employee-cost-by-state"
            className="text-money underline decoration-hairline underline-offset-2 hover:decoration-money"
          >
            Employee Cost by State
          </Link>{" "}
          for a state-by-state breakdown at a fixed salary, or the{" "}
          <Link
            href="/methodology"
            className="text-money underline decoration-hairline underline-offset-2 hover:decoration-money"
          >
            Methodology
          </Link>{" "}
          page for exactly how this is calculated.
        </p>
        <p>
          Want your own salary and state, with optional benefits included?
          Use the{" "}
          <Link
            href="/#calculator"
            className="text-money underline decoration-hairline underline-offset-2 hover:decoration-money"
          >
            full calculator
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
