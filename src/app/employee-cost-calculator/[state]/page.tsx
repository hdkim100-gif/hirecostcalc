import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Calculator from "@/components/Calculator";
import { allStateSlugs, getStateContent } from "@/lib/state-content";
import { getState } from "@/lib/tax-engine";
import { calculate, EMPTY_BENEFITS } from "@/lib/calculate";
import { formatCurrency } from "@/lib/format";

export function generateStaticParams() {
  return allStateSlugs().map((slug) => ({ state: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const content = getStateContent(slug);
  if (!content) return {};
  const state = getState(content.code);
  return {
    title: `Employee Cost Calculator: ${state.name} (${state.year})`,
    description: `See the true cost of hiring an employee in ${state.name}, including employer payroll taxes, SUI, FUTA, and optional benefits. Free calculator, no sign-up.`,
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const content = getStateContent(slug);
  if (!content) notFound();

  const state = getState(content.code);
  const example = calculate({
    annualSalary: 60000,
    stateCode: content.code,
    currentHeadcount: 0,
    includeBenefits: false,
    benefits: EMPTY_BENEFITS,
  });

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-4 sm:pt-24">
        <p className="text-xs uppercase tracking-widest text-cost">
          {state.name} &middot; {state.year} employer costs
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
          How much does an employee cost in{" "}
          <span className="italic text-ink-soft">{state.name}?</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
          {content.intro}
        </p>

        <div className="mt-8 max-w-2xl border-l-2 border-cost pl-5">
          <p className="text-sm text-ink-soft">
            A $60,000 {state.name} employee costs about
          </p>
          <p className="mt-1 font-mono text-3xl font-medium text-money">
            {formatCurrency(example.totalAnnualPerEmployee)}
          </p>
          <p className="mt-1 text-sm text-ink-faint">
            in mandatory employer costs alone — before any optional benefits.
          </p>
        </div>

        <ul className="mt-8 max-w-2xl space-y-2.5 text-sm text-ink-soft">
          {content.facts.map((f) => (
            <li key={f} className="flex gap-3">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-cost" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-faint">
          {content.caution}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <Calculator defaultState={content.code} />
      </section>
    </>
  );
}
