import type { StateTaxYear } from "../types";

/**
 * The remaining 46 states (California, Texas, Florida, and New York have
 * their own files with more detailed research notes).
 *
 * 15 of these — AZ, GA, IL, IN, MA, MD, MI, MO, NC, NJ, OH, PA, TN, VA, WA —
 * were individually verified against official state agency sources (see
 * each entry's `sui.source`), covering most of the next tier of population/
 * business density after the original 4. The other 31 are still compiled
 * from multi-state payroll compliance roundups and not yet individually
 * verified (their `sui.source` is left unset, falling back to a generic
 * "not yet verified" label) — treat those as a starting point, not a final
 * word. A handful of states (marked below) don't publish one flat
 * new-employer rate at all; they assign it from your industry's average
 * claims history, so the number here is only a rough placeholder for those.
 *
 * FUTA credit reduction: per the U.S. Dept. of Labor's April 2026 notice,
 * California (and the U.S. Virgin Islands, a territory) are the only
 * jurisdictions at risk for a 2026 reduction — every other state below
 * gets the standard 0.6% rate. This is redetermined every November and
 * should be rechecked before rolling to the next tax year.
 */

const STANDARD_FUTA = {
  addonRate: 0,
  note: "Standard 0.6% federal rate — this state is not subject to a FUTA credit reduction for 2026.",
} as const;

const UNVERIFIED_SOURCE =
  "Multi-state 2026 payroll compliance roundups; not yet individually verified against the state agency";

function state(
  code: string,
  name: string,
  hasIncomeTax: boolean,
  newEmployerRate: number,
  wageBase: number,
  note?: string,
  source?: string
): StateTaxYear {
  return {
    code,
    name,
    year: 2026,
    hasIncomeTax,
    sui: {
      newEmployerRate,
      wageBase,
      rateRange: [0, 0],
      note,
      source,
    },
    futaCreditReduction: STANDARD_FUTA,
    source: source ?? UNVERIFIED_SOURCE,
    asOf: "2026-01",
  };
}

export const OTHER_STATES_2026: Record<string, StateTaxYear> = {
  AL: state("AL", "Alabama", true, 0.027, 8000),
  AK: state("AK", "Alaska", false, 0.015, 54200),
  AZ: state(
    "AZ",
    "Arizona",
    true,
    0.02,
    8000,
    "Flat rate for new employers' first 2 calendar years.",
    "AZ Dept. of Economic Security (DES)"
  ),
  AR: state("AR", "Arkansas", true, 0.02, 7000),
  CO: state(
    "CO",
    "Colorado",
    true,
    0.0305,
    30600,
    "Non-construction rate; heavy construction employers pay a higher new-employer rate."
  ),
  CT: state("CT", "Connecticut", true, 0.019, 27000),
  DE: state("DE", "Delaware", true, 0.012, 14500),
  GA: state(
    "GA",
    "Georgia",
    true,
    0.027,
    9500,
    undefined,
    "GA Dept. of Labor (GDOL)"
  ),
  HI: state("HI", "Hawaii", true, 0.024, 64500),
  ID: state("ID", "Idaho", true, 0.01, 58300),
  IL: state(
    "IL",
    "Illinois",
    true,
    0.0335,
    14250,
    "Standard entry rate (3.35%, including the 0.55% fund-building surcharge) for most employers who became liable on or after Jan. 1, 2024. Some secondary sources cite a lower 3.175% figure for a different new-employer subgroup — confirm your exact assigned rate on your IDES rate notice.",
    "IL Dept. of Employment Security (IDES)"
  ),
  IN: state(
    "IN",
    "Indiana",
    true,
    0.025,
    9500,
    undefined,
    "IN Dept. of Workforce Development (DWD)"
  ),
  IA: state("IA", "Iowa", true, 0.01, 39500),
  KS: state(
    "KS",
    "Kansas",
    true,
    0.0175,
    15100,
    "Non-construction rate; construction employers pay a higher new-employer rate."
  ),
  KY: state("KY", "Kentucky", true, 0.027, 12000),
  LA: state(
    "LA",
    "Louisiana",
    true,
    0.027,
    7000,
    "Louisiana's new-employer rate depends on your rating; this is a placeholder — verify with the LA Workforce Commission."
  ),
  ME: state("ME", "Maine", true, 0.0254, 12000),
  MD: state(
    "MD",
    "Maryland",
    true,
    0.026,
    8500,
    undefined,
    "MD Dept. of Labor, Division of Unemployment Insurance"
  ),
  MA: state(
    "MA",
    "Massachusetts",
    true,
    0.0242,
    15000,
    "Rate for employers registered under 3 years; construction employers pay 6.08% instead. Experienced employers also owe a separate COVID-19 recovery assessment on top of their base rate.",
    "MA Dept. of Unemployment Assistance (DUA)"
  ),
  MI: state(
    "MI",
    "Michigan",
    true,
    0.027,
    9000,
    "New construction employers pay 5% instead. Delinquent employers face a $9,500 wage base.",
    "MI Unemployment Insurance Agency (UIA)"
  ),
  MN: state(
    "MN",
    "Minnesota",
    true,
    0.0109,
    44000,
    "Minnesota assigns new employers your industry's average rate rather than one flat rate — this is a rough placeholder."
  ),
  MS: state("MS", "Mississippi", true, 0.01, 14000),
  MO: state(
    "MO",
    "Missouri",
    true,
    0.02376,
    9000,
    "Nonprofit new employers pay 1% instead. The wage base dropped to $9,000 for 2026, from $9,500.",
    "MO Dept. of Labor and Industrial Relations (DOLIR)"
  ),
  MT: state("MT", "Montana", true, 0.0118, 47300),
  NE: state(
    "NE",
    "Nebraska",
    true,
    0.0125,
    9000,
    "Non-construction rate; construction employers pay a higher new-employer rate."
  ),
  NV: state("NV", "Nevada", false, 0.03, 43700),
  NH: state("NH", "New Hampshire", false, 0.017, 14000),
  NJ: state(
    "NJ",
    "New Jersey",
    true,
    0.028,
    44800,
    "Flat combined rate (2.6825% UI + 0.1175% workforce/supplemental fund) for new employers' first 3 calendar years. New Jersey also requires a separate employer-paid Temporary Disability Insurance (TDI) contribution (0.5% for new employers, same wage base) — not included in this figure.",
    "NJ Dept. of Labor and Workforce Development"
  ),
  NM: state(
    "NM",
    "New Mexico",
    true,
    0.01,
    34700,
    "New Mexico's new-employer rate can range roughly 1.0%–1.25% by industry — verify with NM Workforce Solutions."
  ),
  NC: state(
    "NC",
    "North Carolina",
    true,
    0.01,
    34200,
    undefined,
    "NC Division of Employment Security (DES)"
  ),
  ND: state(
    "ND",
    "North Dakota",
    true,
    0.01,
    46600,
    "North Dakota's new-employer rate varies by industry and rating; this is a low-end placeholder — verify with Job Service ND."
  ),
  OH: state(
    "OH",
    "Ohio",
    true,
    0.0285,
    9500,
    "Non-construction rate; construction employers pay 5.85% instead. For 2026-2027, all contributory employers also owe a separate Technology and Customer Service Fee of 0.15% on the first $9,000 of wages, on top of the contribution rate.",
    "OH Dept. of Job and Family Services (JFS)"
  ),
  OK: state("OK", "Oklahoma", true, 0.015, 25000),
  OR: state("OR", "Oregon", true, 0.024, 56700),
  PA: state(
    "PA",
    "Pennsylvania",
    true,
    0.03822,
    10000,
    "Includes the 9.2% surcharge in effect for 2026; new construction employers pay 10.5924% instead. Pennsylvania is also one of the few states where employees themselves pay a small SUI withholding (0.07% for 2026) — that's a payroll deduction from the employee, not an added employer cost.",
    "PA Dept. of Labor & Industry (UC-748 rate chart)"
  ),
  RI: state("RI", "Rhode Island", true, 0.0121, 31300),
  SC: state("SC", "South Carolina", true, 0.0106, 14000),
  SD: state(
    "SD",
    "South Dakota",
    false,
    0.012,
    15000,
    "Non-construction rate; construction employers pay a higher new-employer rate."
  ),
  TN: state(
    "TN",
    "Tennessee",
    false,
    0.027,
    7000,
    undefined,
    "TN Dept. of Labor and Workforce Development"
  ),
  UT: state(
    "UT",
    "Utah",
    true,
    0.014,
    50700,
    "Utah assigns new employers your industry's average rate rather than one flat rate — this is a rough placeholder."
  ),
  VT: state("VT", "Vermont", true, 0.01, 15400),
  VA: state(
    "VA",
    "Virginia",
    true,
    0.0278,
    8000,
    "Combines the 2.5% new-employer base rate with add-ons most employers owe regardless of experience: a 0.2% Fund Building Charge, a 0.03% Pool Cost Charge, and (since 2025) a 0.05% administrative fee.",
    "VA Employment Commission (VEC)"
  ),
  WA: state(
    "WA",
    "Washington",
    false,
    0.01,
    78200,
    "Washington assigns new employers your industry's average rate rather than one flat rate — this is a rough placeholder. The $78,200 wage base (up from $72,800) is confirmed for 2026; ESD mails each employer's specific rate in December.",
    "WA Employment Security Department (ESD)"
  ),
  WV: state("WV", "West Virginia", true, 0.027, 9500),
  WI: state("WI", "Wisconsin", true, 0.0305, 14000),
  WY: state(
    "WY",
    "Wyoming",
    false,
    0.0135,
    33800,
    "Wyoming's new-employer rate depends on your industry; this is a rough placeholder — verify with the WY Dept. of Workforce Services."
  ),
};
