export interface FederalTaxYear {
  year: number;
  socialSecurity: {
    employerRate: number;
    wageBase: number;
  };
  medicare: {
    employerRate: number;
  };
  futa: {
    grossRate: number;
    standardCredit: number;
    wageBase: number;
  };
  source: string;
}

export interface PaidSickLeavePolicy {
  /** Annual hour caps by headcount tier, checked in order; the first tier
   * whose maxEmployees is null or >= the employer's total headcount wins. */
  tiers: Array<{ maxEmployees: number | null; annualHours: number }>;
  note?: string;
  source?: string;
}

export interface StateTaxYear {
  code: string;
  name: string;
  year: number;
  hasIncomeTax: boolean;
  sui: {
    newEmployerRate: number;
    wageBase: number;
    rateRange: [number, number];
    note?: string;
    source?: string;
  };
  futaCreditReduction: {
    addonRate: number;
    note?: string;
  };
  /** Only set for states with a state-level mandatory paid sick leave law
   * this calculator currently models. Undefined ≠ "no law" — it may just
   * mean the state (or a city within it) isn't modeled yet. */
  paidSickLeave?: PaidSickLeavePolicy;
  source: string;
  asOf: string;
}
