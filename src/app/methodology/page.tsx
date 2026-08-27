import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How HireCost calculates the true cost of hiring an employee: federal payroll taxes, state unemployment insurance, optional benefits, data sources, and what's not included.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  return (
    <LegalPage eyebrow="Methodology" title="How this number is calculated" updated="2026-08-27">
      <p>
        HireCost adds three layers on top of the salary you enter: mandatory
        federal payroll taxes, mandatory state unemployment insurance, and
        any optional benefits you turn on. The result is the fully-loaded
        annual cost of <strong>one new hire</strong> &mdash; not a team
        total, and not a paycheck/take-home estimate for the employee.
      </p>

      <h2>Federal payroll taxes</h2>
      <p>
        Every employer pays these on top of wages, regardless of state or
        industry.
      </p>
      <ul>
        <li>
          <strong>Employer Social Security</strong> &mdash; 6.2% of wages, up
          to the annual wage base ($184,500 for 2026, per the SSA&rsquo;s
          2026 COLA release).
        </li>
        <li>
          <strong>Employer Medicare</strong> &mdash; 1.45% of all wages, no
          cap.
        </li>
        <li>
          <strong>FUTA (Federal Unemployment)</strong> &mdash; 6.0% on the
          first $7,000 of wages, minus a standard 5.4% credit for employers
          who pay state unemployment on time, netting 0.6% in most states.
          States with an unpaid federal unemployment-trust-fund loan balance
          lose part of that credit, which raises the effective FUTA rate for
          every employer in that state. The U.S. Department of Labor doesn&rsquo;t
          finalize each year&rsquo;s credit-reduction states until after
          November 10, so where we apply a projected add-on (e.g. California
          for 2026), it&rsquo;s flagged as an estimate in the calculator.
        </li>
      </ul>
      <p className="text-sm text-ink-faint">
        Source: Social Security Administration (SSA) 2026 COLA release; IRS
        Form 940 instructions; U.S. Department of Labor.
      </p>

      <h2>State unemployment insurance (SUI)</h2>
      <p>
        This is the one line that genuinely varies by state: each state
        labor/workforce agency sets its own new-employer rate and taxable
        wage base. The calculator assumes your business is a{" "}
        <strong>new employer</strong> (not yet experience-rated) &mdash; an
        established business&rsquo;s real rate depends on its own claims
        history, which this tool can&rsquo;t know.
      </p>
      <p>
        California, Texas, Florida, and New York are individually verified
        against their own agencies (EDD, TWC, DOR, and NY DOL), along
        with 15 more of the largest states, each carrying its own source
        citation on its <Link href="/employee-cost-calculator/california">state page</Link>{" "}
        and in the calculator&rsquo;s assumptions panel. The remaining
        states are compiled from multi-state payroll compliance sources;
        confirm those against your own state&rsquo;s labor department before
        relying on them for an actual hire.
      </p>

      <h2>Paid sick &amp; paid leave laws</h2>
      <p>
        Modeled today for California (a flat 40 hours/year) and New York (40
        or 56 hours/year, tiered by headcount). It&rsquo;s shown as a
        separate info line, not added to the total &mdash; for a salaried
        employee it&rsquo;s already covered by their fixed salary, so
        summing it in would double-count it. Roughly 15 other states have
        their own paid sick/paid leave laws not modeled yet, and no
        city-level ordinance (NYC, SF, Seattle, etc.) is modeled.
      </p>

      <h2>Optional benefits</h2>
      <p>
        Off by default, and fully editable: health insurance, 401(k) match,
        bonus, meals, and other perks. Health insurance defaults to the most
        recent KFF (Kaiser Family Foundation) Employer Health Benefits Survey
        national-average employer contribution &mdash; replace it with your
        own quote for an exact number. Workers&rsquo; compensation defaults
        to a rough national average by industry, since real per-class-code
        premium data is commercially licensed, not public; enter your own
        annual premium if you have one.
      </p>

      <h2>What isn&rsquo;t included</h2>
      <ul>
        <li>
          PTO / paid holidays &mdash; discretionary in most states and
          mostly an opportunity cost rather than an added cash cost for a
          salaried employee, which makes it a fundamentally different kind
          of number than the mandatory tax/benefit lines above.
        </li>
        <li>
          A precise per-class-code workers&rsquo; comp premium (real NCCI
          class-code rate data is commercially licensed).
        </li>
        <li>City- or county-level payroll tax and paid-leave ordinances.</li>
        <li>Employee-vs-contractor cost comparisons.</li>
      </ul>

      <h2>Data year &amp; update schedule</h2>
      <p>
        All figures are for the <strong>2026 tax year</strong>. We check the
        Social Security wage base each October, when the SSA announces the
        following year&rsquo;s number; FUTA credit-reduction states each
        November, when the Department of Labor publishes its determination;
        and state SUI new-employer rates and wage bases as each
        state&rsquo;s labor department updates them, typically effective
        January 1. Every line in the calculator&rsquo;s{" "}
        <Link href="/#calculator">assumptions panel</Link> and every state
        page shows the specific source behind that number.
      </p>

      <h2>Sources</h2>
      <ul>
        <li>Social Security Administration (SSA)</li>
        <li>Internal Revenue Service (IRS) &mdash; Form 940 instructions</li>
        <li>
          U.S. Department of Labor &mdash; FUTA credit reduction
          determinations
        </li>
        <li>
          Each state&rsquo;s unemployment insurance / labor agency &mdash;
          see the relevant <Link href="/employee-cost-calculator/california">state page</Link>{" "}
          for the exact citation
        </li>
        <li>
          KFF (Kaiser Family Foundation) Employer Health Benefits Survey
          &mdash; health insurance default
        </li>
      </ul>

      <p>
        None of this is tax, payroll, legal, or accounting advice &mdash;
        see <Link href="/terms">Terms</Link> for the full disclaimer. Found a
        rate that looks wrong? Email{" "}
        <a href="mailto:contact@hirecostcalc.com">contact@hirecostcalc.com</a>.
      </p>
    </LegalPage>
  );
}
