import type { StateTaxYear } from "../../types";

export const FL_2026: StateTaxYear = {
  code: "FL",
  name: "Florida",
  year: 2026,
  hasIncomeTax: false,
  sui: {
    newEmployerRate: 0.027,
    wageBase: 7000,
    rateRange: [0.001, 0.054],
    note: "Florida calls this the Reemployment Tax. New employers pay 2.7% for their first 10 quarters.",
  },
  futaCreditReduction: {
    addonRate: 0,
    note: "Florida's UI trust fund is not in a federal loan balance for 2026, so the standard 0.6% FUTA rate applies.",
  },
  source: "Florida Department of Revenue (Reemployment Tax)",
  asOf: "2026-01",
};
