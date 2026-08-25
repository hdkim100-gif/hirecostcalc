/**
 * Illustrative national-average defaults for benefit costs that have no
 * published statutory rate (unlike payroll taxes, these are market prices).
 * Always editable — treat as a rough starting point, not a quote.
 */

// KFF 2025 Employer Health Benefits Survey: avg. single-coverage premium
// $9,325/yr, employee pays ~16% ($1,440), employer covers the rest (~$7,885/yr).
export const HEALTH_INSURANCE_NATIONAL_AVERAGE_MONTHLY = 657;
export const HEALTH_INSURANCE_SOURCE_NOTE =
  "Based on the KFF 2025 Employer Health Benefits Survey national average employer contribution for single coverage (~$7,885/yr). Actual small-group premiums vary widely by state, plan, and employee age — replace with your own quote.";

export interface WorkersCompIndustry {
  key: string;
  label: string;
  rate: number;
}

// Rough national-average rates per $1 of payroll, built from published
// NCCI-class-code ranges (e.g. clerical ~$0.16/$100, general average
// ~$1.03/$100, carpentry ~$8-20/$100, roofing ~$14/$100). Real premiums are
// set by state, exact class code, and carrier — these buckets are only a
// starting estimate for someone who doesn't have a quote yet.
export const WORKERS_COMP_INDUSTRIES: WorkersCompIndustry[] = [
  { key: "average", label: "Not sure / overall average", rate: 0.0103 },
  { key: "office", label: "Office / professional services", rate: 0.003 },
  { key: "retail", label: "Retail / food / hospitality", rate: 0.015 },
  { key: "manufacturing", label: "Manufacturing / warehouse", rate: 0.035 },
  { key: "construction", label: "Construction / trades", rate: 0.09 },
];

export function workersCompRate(key: string): number {
  return (
    WORKERS_COMP_INDUSTRIES.find((i) => i.key === key)?.rate ??
    WORKERS_COMP_INDUSTRIES[0].rate
  );
}

export function workersCompLabel(key: string): string {
  return (
    WORKERS_COMP_INDUSTRIES.find((i) => i.key === key)?.label ??
    WORKERS_COMP_INDUSTRIES[0].label
  );
}
