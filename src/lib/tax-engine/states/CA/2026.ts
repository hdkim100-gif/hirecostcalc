import type { StateTaxYear } from "../../types";

export const CA_2026: StateTaxYear = {
  code: "CA",
  name: "California",
  year: 2026,
  hasIncomeTax: true,
  sui: {
    newEmployerRate: 0.034,
    wageBase: 7000,
    rateRange: [0.015, 0.062],
    note: "New employers pay 3.4% for roughly their first 2-3 years before an experience rate applies.",
    source: "CA Employment Development Department (EDD)",
  },
  futaCreditReduction: {
    addonRate: 0.015,
    note:
      "Includes the projected 2026 California FUTA credit reduction (California has carried an unpaid federal UI loan balance since 2020). Final 2026 credit-reduction rates are determined by the U.S. Dept. of Labor after November 10 — treat this line as an estimate until then.",
  },
  paidSickLeave: {
    tiers: [{ maxEmployees: null, annualHours: 40 }],
    note:
      "California requires at least 40 hours (5 days) of paid sick leave per year for nearly all employers, regardless of size. Shown as a maximum possible cost — it's only actually spent if the leave is used.",
    source: "CA Healthy Workplaces, Healthy Families Act (Labor Code)",
  },
  source: "EDD (California SUI); DOL FUTA credit reduction determination; CA Healthy Workplaces Healthy Families Act",
  asOf: "2026-01",
};
