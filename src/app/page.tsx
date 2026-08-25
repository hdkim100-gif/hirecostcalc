import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import { STATE_LIST } from "@/lib/tax-engine";
import { slugify } from "@/lib/state-content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const FAQ_ITEMS = [
  {
    q: "Why is the employer cost higher than the salary I offer?",
    a: "Federal and state law require employers — not just employees — to pay their own share of Social Security, Medicare, and unemployment insurance on top of wages. Employer payroll taxes and optional benefits like health insurance or a 401(k) match can push the total cost meaningfully above salary alone — by how much depends on your state, your benefits, and your industry's workers' comp rate.",
  },
  {
    q: "Is this the same as a paycheck or take-home pay calculator?",
    a: "No. Paycheck calculators show what an employee takes home after their own withholding. HireCost shows the other side of the ledger: what the employer pays in addition to salary. They answer different questions.",
  },
  {
    q: "Why does the FUTA rate differ by state?",
    a: "The standard federal unemployment rate is 0.6%. But if a state's unemployment trust fund carries an unpaid federal loan balance, the U.S. Department of Labor reduces that state's credit — raising the effective FUTA rate for every employer in it. California is expected to remain a credit-reduction state for 2026, and this calculator includes that projection — but the DOL doesn't finalize each year's credit-reduction states and rates until after November 10, so treat that line as an estimate until then.",
  },
  {
    q: "How accurate is the Hiring Budget number?",
    a: "It solves for the salary whose fully-loaded monthly cost matches your budget, using the same mandatory tax rates as the calculator above. It's an estimate for a new employer, one hire at a time — not a substitute for a quote from your payroll provider or accountant.",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-4 sm:pt-24">
        <p className="text-xs uppercase tracking-widest text-cost">
          Small business hiring
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
          A $60,000 hire doesn&rsquo;t cost you{" "}
          <span className="italic text-ink-soft">$60,000.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
          Salary is the sticker price. Employer payroll taxes and benefits
          are the real bill. See the full number below &mdash; before you
          make the offer.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <Calculator defaultState="CA" />
      </section>

      <section className="border-t border-hairline bg-paper-raised">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-lg text-ink">
              Built for the decision
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Not a paycheck calculator. HireCost answers the question an
              owner actually asks before extending an offer: can the
              business afford this person, fully loaded.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg text-ink">
              Nothing stored, no account
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              No sign-up, no email gate. Your salary and budget numbers never
              leave your device &mdash; this isn&rsquo;t a lead form for a
              payroll subscription.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg text-ink">
              A tool, not a SaaS bill
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Priced once, if at all &mdash; not a recurring line item next
              to the payroll costs it just showed you.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-display text-2xl text-ink">
          Employee cost in all 50 states
        </h2>
        <p className="mt-2 max-w-lg text-sm text-ink-soft">
          Payroll tax rules differ by state &mdash; unemployment insurance
          rates, wage bases, and in some years, federal credit reductions.
          Start from your state for the full picture.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
          {STATE_LIST.map((s) => (
            <Link
              key={s.code}
              href={`/employee-cost-calculator/${slugify(s.name)}`}
              className="border-b border-transparent py-1.5 text-sm text-ink-soft transition-colors hover:border-hairline hover:text-ink"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="font-display text-2xl text-ink">Common questions</h2>
          <div className="mt-8 space-y-8">
            {FAQ_ITEMS.map(({ q, a }) => (
              <Faq key={q} q={q}>
                {a}
              </Faq>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
    </>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-ink">{q}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        {children}
      </p>
    </div>
  );
}
