import { STATE_LIST, effectiveFutaRate, type StateTaxYear } from "./tax-engine";

export interface StateSlugContent {
  slug: string;
  code: string;
  intro: string;
  facts: string[];
  caution: string;
}

/**
 * Hand-researched content for the original Phase 1 states — richer,
 * narrative facts with more specific caveats than the auto-generated
 * fallback below covers for the other 46 states.
 */
export const STATE_CONTENT: Record<string, StateSlugContent> = {
  california: {
    slug: "california",
    code: "CA",
    intro:
      "California is one of the more expensive states to hire in on the employer side of the ledger — not because of income tax (that's the employee's burden), but because of a higher new-employer SUI rate and a projected federal FUTA credit reduction that most calculators skip.",
    facts: [
      "New-employer SUI: 3.4% on the first $7,000 of wages.",
      "FUTA credit reduction (projected): California has carried an unpaid federal UI loan balance since 2020. It's expected to remain a credit-reduction state for 2026, which would push effective FUTA to roughly 2.1% instead of the standard 0.6% — but the U.S. Dept. of Labor doesn't finalize this until after November 10.",
      "No separate employer-side state income tax withholding cost — California income tax is withheld from the employee's wages, not paid by the employer.",
    ],
    caution:
      "California is expected to remain a FUTA credit-reduction state for 2026, subject to final federal determination after November 10. Treat the FUTA line as an estimate until then.",
  },
  texas: {
    slug: "texas",
    code: "TX",
    intro:
      "Texas has no state income tax, and its new-employer unemployment rate is close to the national median — which makes the mandatory employer cost here mostly a function of federal payroll tax and the state's $9,000 SUI wage base.",
    facts: [
      "New-employer SUI: 2.7% (or your NAICS industry average, if higher) on the first $9,000 of wages.",
      "Standard FUTA rate applies: 0.6% — Texas is not subject to a federal credit reduction for 2026.",
      "No state income tax, for either employer or employee.",
    ],
    caution:
      "Texas assigns some new employers a rate above 2.7% based on their industry's historical claims — construction and staffing firms in particular should confirm their assigned rate with the Texas Workforce Commission.",
  },
  florida: {
    slug: "florida",
    code: "FL",
    intro:
      "Florida calls its unemployment tax the Reemployment Tax, but the mechanics are the same as SUI elsewhere. Combined with no state income tax, Florida is one of the lower mandatory-cost states to hire in.",
    facts: [
      "New-employer Reemployment Tax: 2.7% on the first $7,000 of wages, fixed for your first 10 quarters.",
      "Standard FUTA rate applies: 0.6% — Florida is not subject to a federal credit reduction for 2026.",
      "No state income tax, for either employer or employee.",
    ],
    caution:
      "After 10 quarters, Florida moves employers to an experience rate that can range from 0.1% up to 5.4% depending on claims history — budget for this to change once you're past your first two-plus years.",
  },
  "new-york": {
    slug: "new-york",
    code: "NY",
    intro:
      "New York has the highest SUI wage base of the four states here, plus a subsidiary tax add-on that most new-employer rate quotes leave out. The state avoided a 2026 FUTA credit reduction by repaying its federal loan balance ahead of the deadline.",
    facts: [
      "New-employer SUI: normal contribution of 3.4% plus a subsidiary tax, for an effective rate near 4.1%, on the first $17,600 of wages.",
      "Standard FUTA rate applies: 0.6% — New York repaid its federal UI loan before the November 2025 deadline and avoided the 2026 credit reduction.",
      "State income tax is withheld from the employee's wages, not paid directly by the employer.",
    ],
    caution:
      "New York's SUI wage base now indexes to 18% of the state average annual wage every year (it jumped from $12,800 to $17,600 for 2026 under this new formula), so expect it to keep climbing.",
  },
};

export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function generateContent(state: StateTaxYear): StateSlugContent {
  const futaRate = effectiveFutaRate(state);
  const futaIsStandard = state.futaCreditReduction.addonRate === 0;

  const facts = [
    `New-employer SUI: ${(state.sui.newEmployerRate * 100).toFixed(2).replace(/\.?0+$/, "")}% on the first $${state.sui.wageBase.toLocaleString()} of wages.`,
    futaIsStandard
      ? "Standard FUTA rate applies: 0.6% — this state is not projected to face a federal credit reduction for 2026."
      : `FUTA credit reduction projected: effective federal rate is estimated near ${(futaRate * 100).toFixed(2)}% instead of the standard 0.6% — the U.S. Dept. of Labor finalizes each year's credit-reduction states and rates after November 10.`,
    state.hasIncomeTax
      ? "State income tax is withheld from the employee's wages, not paid directly by the employer."
      : "No state income tax, for either employer or employee.",
  ];

  return {
    slug: slugify(state.name),
    code: state.code,
    intro: `${state.name}'s mandatory employer payroll costs come from federal Social Security and Medicare, plus this state's own unemployment insurance rate and wage base. Below is a ${state.year} estimate for a $60,000 hire, and the full calculator to run your own numbers.`,
    facts,
    caution:
      state.sui.note ??
      `New-employer unemployment rates change yearly and can vary by industry — confirm your assigned rate with ${state.name}'s labor or workforce agency before budgeting.`,
  };
}

export function getStateContent(slug: string): StateSlugContent | undefined {
  if (STATE_CONTENT[slug]) return STATE_CONTENT[slug];
  const state = STATE_LIST.find((s) => slugify(s.name) === slug);
  return state ? generateContent(state) : undefined;
}

export function allStateSlugs(): string[] {
  return STATE_LIST.map((s) => slugify(s.name));
}
