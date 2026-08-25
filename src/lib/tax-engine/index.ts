import { FEDERAL_2026 } from "./federal/2026";
import { CA_2026 } from "./states/CA/2026";
import { TX_2026 } from "./states/TX/2026";
import { FL_2026 } from "./states/FL/2026";
import { NY_2026 } from "./states/NY/2026";
import { OTHER_STATES_2026 } from "./states/other-2026";
import type { StateTaxYear } from "./types";

export const TAX_YEAR = 2026;
export const FEDERAL = FEDERAL_2026;

export const STATES: Record<string, StateTaxYear> = {
  CA: CA_2026,
  TX: TX_2026,
  FL: FL_2026,
  NY: NY_2026,
  ...OTHER_STATES_2026,
};

export const STATE_LIST = Object.values(STATES).sort((a, b) =>
  a.name.localeCompare(b.name)
);

export type StateCode = keyof typeof STATES;

export function getState(code: string): StateTaxYear {
  const state = STATES[code.toUpperCase()];
  if (!state) {
    throw new Error(`Unsupported state: ${code}`);
  }
  return state;
}

export function isSupportedState(code: string): boolean {
  return Boolean(STATES[code.toUpperCase()]);
}

export function effectiveFutaRate(state: StateTaxYear): number {
  const netStandard = FEDERAL.futa.grossRate - FEDERAL.futa.standardCredit;
  return netStandard + state.futaCreditReduction.addonRate;
}

export type { FederalTaxYear, StateTaxYear } from "./types";
