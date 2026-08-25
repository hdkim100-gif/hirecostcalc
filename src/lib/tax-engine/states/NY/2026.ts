import type { StateTaxYear } from "../../types";

export const NY_2026: StateTaxYear = {
  code: "NY",
  name: "New York",
  year: 2026,
  hasIncomeTax: true,
  sui: {
    newEmployerRate: 0.041,
    wageBase: 17600,
    rateRange: [0.02025, 0.09825],
    note:
      "New employer rate combines the 3.4% normal contribution plus the subsidiary tax, for an effective ~4.1%. The wage base jumped to $17,600 for 2026 under a new law indexing it to 18% of the state average annual wage each year — expect it to keep climbing.",
    source: "NY Dept. of Labor (UI rate information)",
  },
  futaCreditReduction: {
    addonRate: 0,
    note:
      "New York repaid its federal UI loan balance before the November 2025 deadline, avoiding the 2026 FUTA credit reduction. The standard 0.6% FUTA rate applies.",
  },
  paidSickLeave: {
    tiers: [
      { maxEmployees: 99, annualHours: 40 },
      { maxEmployees: null, annualHours: 56 },
    ],
    note:
      "New York requires 40 hours of paid sick leave per year for employers with under 100 employees, and 56 hours at 100+. Employers with 4 or fewer employees and under $1M in net income may provide this unpaid instead — not modeled here. Shown as a maximum possible cost — it's only actually spent if the leave is used.",
    source: "NY Paid Sick Leave Law (NY Labor Law)",
  },
  source: "NY Dept. of Labor (UI rate information); NY Paid Sick Leave Law",
  asOf: "2026-01",
};
