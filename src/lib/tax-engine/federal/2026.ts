import type { FederalTaxYear } from "../types";

// 2026 federal employer payroll tax parameters.
// Social Security wage base confirmed by SSA (announced Oct 24, 2025): $184,500.
// FUTA standard credit of 5.4% yields a 0.6% net federal rate absent a state
// credit reduction (see states/*/2026.ts for state-specific add-ons).
export const FEDERAL_2026: FederalTaxYear = {
  year: 2026,
  socialSecurity: {
    employerRate: 0.062,
    wageBase: 184500,
  },
  medicare: {
    employerRate: 0.0145,
  },
  futa: {
    grossRate: 0.06,
    standardCredit: 0.054,
    wageBase: 7000,
  },
  source: "SSA 2026 COLA release; IRS Form 940 instructions",
};
