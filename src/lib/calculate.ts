import { FEDERAL, effectiveFutaRate, getState, type StateTaxYear } from "./tax-engine";
import {
  HEALTH_INSURANCE_NATIONAL_AVERAGE_MONTHLY,
  HEALTH_INSURANCE_SOURCE_NOTE,
  workersCompLabel,
  workersCompRate,
} from "./benefit-defaults";

const FULL_TIME_ANNUAL_HOURS = 2080;

export interface BenefitsInput {
  healthInsuranceMonthly: number;
  retirementMatchPercent: number;
  bonusAnnual: number;
  mealsMonthly: number;
  otherMonthly: number;
  workersCompMode: "industry" | "custom";
  workersCompIndustryKey: string;
  workersCompCustomAnnual: number;
}

/** All-zero benefits, for calculations that intentionally want none. */
export const EMPTY_BENEFITS: BenefitsInput = {
  healthInsuranceMonthly: 0,
  retirementMatchPercent: 0,
  bonusAnnual: 0,
  mealsMonthly: 0,
  otherMonthly: 0,
  workersCompMode: "industry",
  workersCompIndustryKey: "average",
  workersCompCustomAnnual: 0,
};

/** Sensible starting point once a user turns benefits on in the UI. */
export const DEFAULT_UI_BENEFITS: BenefitsInput = {
  ...EMPTY_BENEFITS,
  healthInsuranceMonthly: HEALTH_INSURANCE_NATIONAL_AVERAGE_MONTHLY,
};

export interface CalculatorInput {
  annualSalary: number;
  stateCode: string;
  /** Employees already on payroll, not counting this new hire. */
  currentHeadcount: number;
  includeBenefits: boolean;
  benefits: BenefitsInput;
}

export interface LineItem {
  key: string;
  label: string;
  annualPerEmployee: number;
  rateLabel?: string;
  note?: string;
  /** Short caveat shown directly in the main receipt (e.g. an asterisk
   * footnote) — for context important enough that burying it in the
   * assumptions panel alone would be misleading. Keep this to one line;
   * the fuller explanation belongs in `note`. */
  shortNote?: string;
  /** Short attribution (e.g. "SSA / IRS") shown next to this line in the
   * assumptions panel. */
  source?: string;
  category: "base" | "mandatory" | "benefit";
}

/** Informational only — not summed into the cost totals. See PaidSickLeaveInfo. */
export interface PaidSickLeaveInfo {
  label: string;
  hoursLabel: string;
  annualValue: number;
  note?: string;
  source?: string;
}

export interface CalculationResult {
  stateCode: string;
  stateName: string;
  taxYear: number;
  /** Headcount including this new hire (e.g. 8 = "your 8th employee"). */
  headcountAfterHire: number;
  baseSalaryAnnual: number;
  mandatoryLines: LineItem[];
  benefitLines: LineItem[];
  mandatoryAnnualPerEmployee: number;
  benefitsAnnualPerEmployee: number;
  totalAnnualPerEmployee: number;
  totalMonthlyPerEmployee: number;
  multiplierOfSalary: number;
  /** Set when headcount is at or near a legal threshold (ACA, etc). */
  thresholdNote?: string;
  /**
   * Shown separately, not added to any total: for a salaried employee, paid
   * sick leave is usually already covered by the fixed salary (they're paid
   * whether they're at their desk or out sick), so counting it as an
   * additional cost on top of salary would double-count it. It's still a
   * real legal requirement worth knowing about, hence shown — just not
   * summed in.
   */
  paidSickLeave?: PaidSickLeaveInfo;
}

function paidSickLeaveInfo(
  annualSalary: number,
  state: StateTaxYear,
  headcountAfterHire: number
): PaidSickLeaveInfo | undefined {
  const policy = state.paidSickLeave;
  if (!policy) return undefined;

  const tier =
    policy.tiers.find(
      (t) => t.maxEmployees === null || headcountAfterHire <= t.maxEmployees
    ) ?? policy.tiers[policy.tiers.length - 1];

  const hourlyRate = annualSalary / FULL_TIME_ANNUAL_HOURS;
  const annualValue = hourlyRate * tier.annualHours;

  return {
    label: "Paid Sick Leave Requirement",
    hoursLabel: `Up to ${tier.annualHours} hours/year`,
    annualValue,
    note:
      (policy.note ? policy.note + " " : "") +
      "Already included in salary for salaried employees — not added to the cost total. Shown for planning purposes only.",
    source: policy.source,
  };
}

function thresholdNote(headcountAfterHire: number): string | undefined {
  if (headcountAfterHire >= 50) {
    return "At 50+ full-time-equivalent employees, the ACA employer mandate requires offering health coverage (or paying a penalty) — that penalty isn't calculated here.";
  }
  if (headcountAfterHire >= 45) {
    return "You're within a few hires of the ACA's 50-employee threshold, where offering health coverage becomes federally required.";
  }
  return undefined;
}

function mandatoryLineItems(annualSalary: number, stateCode: string): LineItem[] {
  const state = getState(stateCode);
  const ssTaxable = Math.min(annualSalary, FEDERAL.socialSecurity.wageBase);
  const futaTaxable = Math.min(annualSalary, FEDERAL.futa.wageBase);
  const suiTaxable = Math.min(annualSalary, state.sui.wageBase);
  const futaRate = effectiveFutaRate(state);
  const isFutaProjected = state.futaCreditReduction.addonRate > 0;

  const lines: LineItem[] = [
    {
      key: "ss",
      label: "Employer Social Security",
      annualPerEmployee: ssTaxable * FEDERAL.socialSecurity.employerRate,
      rateLabel: `${(FEDERAL.socialSecurity.employerRate * 100).toFixed(1)}% up to $${FEDERAL.socialSecurity.wageBase.toLocaleString()}`,
      source: "SSA / IRS",
      category: "mandatory",
    },
    {
      key: "medicare",
      label: "Employer Medicare",
      annualPerEmployee: annualSalary * FEDERAL.medicare.employerRate,
      rateLabel: `${(FEDERAL.medicare.employerRate * 100).toFixed(2)}%, no wage cap`,
      source: "IRS",
      category: "mandatory",
    },
    {
      key: "futa",
      label: isFutaProjected ? "Estimated FUTA" : "FUTA (Federal Unemployment)",
      annualPerEmployee: futaTaxable * futaRate,
      rateLabel: `${(futaRate * 100).toFixed(2)}% up to $${FEDERAL.futa.wageBase.toLocaleString()}${isFutaProjected ? "*" : ""}`,
      note: isFutaProjected ? state.futaCreditReduction.note : undefined,
      shortNote: isFutaProjected
        ? `*Projected ${state.year} ${state.code} credit reduction`
        : undefined,
      source: "IRS / U.S. Dept. of Labor",
      category: "mandatory",
    },
    {
      key: "sui",
      label: `State Unemployment (${state.code} SUI)`,
      annualPerEmployee: suiTaxable * state.sui.newEmployerRate,
      rateLabel: `${(state.sui.newEmployerRate * 100).toFixed(2).replace(/\.?0+$/, "")}% up to $${state.sui.wageBase.toLocaleString()}`,
      note: state.sui.note,
      source: state.sui.source ?? state.source,
      category: "mandatory",
    },
  ];

  return lines;
}

function benefitLineItems(
  annualSalary: number,
  benefits: BenefitsInput
): LineItem[] {
  const items: LineItem[] = [];
  if (benefits.healthInsuranceMonthly > 0) {
    items.push({
      key: "health",
      label: "Health Insurance",
      annualPerEmployee: benefits.healthInsuranceMonthly * 12,
      rateLabel: `$${benefits.healthInsuranceMonthly.toLocaleString()}/mo`,
      note:
        benefits.healthInsuranceMonthly === HEALTH_INSURANCE_NATIONAL_AVERAGE_MONTHLY
          ? HEALTH_INSURANCE_SOURCE_NOTE
          : undefined,
      category: "benefit",
    });
  }
  if (benefits.retirementMatchPercent > 0) {
    items.push({
      key: "401k",
      label: "401(k) Match",
      annualPerEmployee: annualSalary * (benefits.retirementMatchPercent / 100),
      rateLabel: `${benefits.retirementMatchPercent}% of salary (est.)`,
      note: "Actual match depends on each employee's own contribution and your plan formula.",
      category: "benefit",
    });
  }
  if (benefits.bonusAnnual > 0) {
    items.push({
      key: "bonus",
      label: "Bonus",
      annualPerEmployee: benefits.bonusAnnual,
      category: "benefit",
    });
  }
  if (benefits.mealsMonthly > 0) {
    items.push({
      key: "meals",
      label: "Meals / Snacks",
      annualPerEmployee: benefits.mealsMonthly * 12,
      rateLabel: `$${benefits.mealsMonthly.toLocaleString()}/mo`,
      category: "benefit",
    });
  }
  if (benefits.otherMonthly > 0) {
    items.push({
      key: "other",
      label: "Other Benefits",
      annualPerEmployee: benefits.otherMonthly * 12,
      rateLabel: `$${benefits.otherMonthly.toLocaleString()}/mo`,
      category: "benefit",
    });
  }

  const workersCompAnnual =
    benefits.workersCompMode === "custom"
      ? benefits.workersCompCustomAnnual
      : annualSalary * workersCompRate(benefits.workersCompIndustryKey);

  if (workersCompAnnual > 0) {
    items.push({
      key: "workerscomp",
      label: "Workers' Compensation",
      annualPerEmployee: workersCompAnnual,
      rateLabel:
        benefits.workersCompMode === "custom"
          ? "your entered premium"
          : `~${(workersCompRate(benefits.workersCompIndustryKey) * 100).toFixed(2)}% of payroll (${workersCompLabel(benefits.workersCompIndustryKey)}, rough national average)`,
      note: "Real premiums are set by your state, exact class code, and carrier — this is a rough national estimate. Enter your own quote for accuracy.",
      category: "benefit",
    });
  }

  return items;
}

export function calculate(input: CalculatorInput): CalculationResult {
  const state = getState(input.stateCode);
  const headcountAfterHire = Math.max(0, Math.round(input.currentHeadcount)) + 1;

  const mandatoryLines = mandatoryLineItems(input.annualSalary, input.stateCode);
  const benefitLines = input.includeBenefits
    ? benefitLineItems(input.annualSalary, input.benefits)
    : [];

  const mandatoryAnnualPerEmployee = mandatoryLines.reduce(
    (sum, l) => sum + l.annualPerEmployee,
    0
  );
  const benefitsAnnualPerEmployee = benefitLines.reduce(
    (sum, l) => sum + l.annualPerEmployee,
    0
  );
  const totalAnnualPerEmployee =
    input.annualSalary + mandatoryAnnualPerEmployee + benefitsAnnualPerEmployee;

  return {
    stateCode: state.code,
    stateName: state.name,
    taxYear: state.year,
    headcountAfterHire,
    baseSalaryAnnual: input.annualSalary,
    mandatoryLines,
    benefitLines,
    mandatoryAnnualPerEmployee,
    benefitsAnnualPerEmployee,
    totalAnnualPerEmployee,
    totalMonthlyPerEmployee: totalAnnualPerEmployee / 12,
    multiplierOfSalary:
      input.annualSalary > 0 ? totalAnnualPerEmployee / input.annualSalary : 0,
    thresholdNote: thresholdNote(headcountAfterHire),
    paidSickLeave: paidSickLeaveInfo(input.annualSalary, state, headcountAfterHire),
  };
}

/**
 * Solves for the highest annual salary whose fully-loaded monthly cost (for
 * this one new hire) fits inside a monthly hiring budget. The cost curve is
 * piecewise-linear (wage-base caps on SS/FUTA/SUI) but monotonic in salary,
 * so bisection converges reliably without needing the inverse formula.
 */
export function solveAffordableSalary(
  monthlyBudget: number,
  stateCode: string,
  currentHeadcount: number,
  includeBenefits: boolean,
  benefits: BenefitsInput
): number {
  const costAtSalary = (salary: number) =>
    calculate({
      annualSalary: salary,
      stateCode,
      currentHeadcount,
      includeBenefits,
      benefits,
    }).totalMonthlyPerEmployee;

  let lo = 0;
  let hi = 2_000_000;

  if (costAtSalary(hi) < monthlyBudget) {
    return hi;
  }

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (costAtSalary(mid) <= monthlyBudget) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return Math.max(0, Math.floor(lo));
}
