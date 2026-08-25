import type { StateTaxYear } from "../../types";

export const TX_2026: StateTaxYear = {
  code: "TX",
  name: "Texas",
  year: 2026,
  hasIncomeTax: false,
  sui: {
    newEmployerRate: 0.027,
    wageBase: 9000,
    rateRange: [0.0032, 0.0632],
    note: "New employers pay 2.7% (or their NAICS industry average, if higher) for roughly the first 2-3 years.",
  },
  futaCreditReduction: {
    addonRate: 0,
    note: "Texas's UI trust fund is not in a federal loan balance for 2026, so the standard 0.6% FUTA rate applies.",
  },
  source: "Texas Workforce Commission (TWC)",
  asOf: "2026-01",
};
