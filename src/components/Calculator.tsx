"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { STATE_LIST } from "@/lib/tax-engine";
import {
  calculate,
  DEFAULT_UI_BENEFITS,
  type BenefitsInput,
} from "@/lib/calculate";
import { WORKERS_COMP_INDUSTRIES } from "@/lib/benefit-defaults";
import { formatCurrency } from "@/lib/format";
import Receipt from "./Receipt";
import HiringBudget from "./HiringBudget";
import DetailAssumptions from "./DetailAssumptions";

export default function Calculator({
  defaultState = "CA",
}: {
  defaultState?: string;
}) {
  const [salaryInput, setSalaryInput] = useState("60000");
  const [salary, setSalary] = useState(60000);
  const [stateCode, setStateCode] = useState(defaultState);
  const [currentHeadcount, setCurrentHeadcount] = useState(4);
  const [includeBenefits, setIncludeBenefits] = useState(false);
  const [benefits, setBenefits] = useState<BenefitsInput>(DEFAULT_UI_BENEFITS);
  const [printVersion, setPrintVersion] = useState(0);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [receiptVisible, setReceiptVisible] = useState(true);

  useEffect(() => {
    const node = receiptRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setReceiptVisible(entry.isIntersecting),
      { rootMargin: "-56px 0px 0px 0px", threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const digits = salaryInput.replace(/[^0-9]/g, "");
    const value = digits ? parseInt(digits, 10) : 0;
    const handle = setTimeout(() => {
      setSalary(value);
      setPrintVersion((v) => v + 1);
    }, 350);
    return () => clearTimeout(handle);
  }, [salaryInput]);

  const result = useMemo(
    () =>
      calculate({
        annualSalary: salary,
        stateCode,
        currentHeadcount,
        includeBenefits,
        benefits,
      }),
    [salary, stateCode, currentHeadcount, includeBenefits, benefits]
  );

  function updateBenefit<K extends keyof BenefitsInput>(
    key: K,
    value: BenefitsInput[K]
  ) {
    setBenefits((b) => ({ ...b, [key]: value }));
    setPrintVersion((v) => v + 1);
  }

  return (
    <div id="calculator" className="scroll-mt-24">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
        {/* Inputs */}
        <div className="space-y-8">
          <div className="space-y-5 rounded-sm border border-hairline bg-paper-raised p-6 sm:p-8">
            <div>
              <label
                htmlFor="salary"
                className="mb-1.5 block text-sm text-ink-soft"
              >
                New hire&rsquo;s annual salary
              </label>
              <div className="flex items-center border-b border-hairline focus-within:border-ink">
                <span className="font-mono text-2xl text-ink-faint">$</span>
                <input
                  id="salary"
                  inputMode="numeric"
                  value={Number(
                    salaryInput.replace(/[^0-9]/g, "") || "0"
                  ).toLocaleString("en-US")}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  className="w-full bg-transparent py-2 pl-2 font-mono text-2xl font-medium text-ink outline-none"
                  aria-describedby="salary-hint"
                />
              </div>
              <p id="salary-hint" className="mt-1.5 text-xs text-ink-faint">
                What you&rsquo;d pay this person — before taxes or benefits.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="state"
                  className="mb-1.5 block text-sm text-ink-soft"
                >
                  State
                </label>
                <select
                  id="state"
                  value={stateCode}
                  onChange={(e) => {
                    setStateCode(e.target.value);
                    setPrintVersion((v) => v + 1);
                  }}
                  className="w-full border-b border-hairline bg-transparent py-2 text-ink outline-none focus:border-ink"
                >
                  {STATE_LIST.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="headcount"
                  className="mb-1.5 block text-sm text-ink-soft"
                >
                  Current employees
                </label>
                <div className="flex items-center border-b border-hairline">
                  <button
                    type="button"
                    aria-label="Decrease current headcount"
                    onClick={() => {
                      setCurrentHeadcount((n) => Math.max(0, n - 1));
                      setPrintVersion((v) => v + 1);
                    }}
                    className="flex h-11 w-9 shrink-0 items-center justify-center text-ink-soft hover:text-ink"
                  >
                    &minus;
                  </button>
                  <input
                    id="headcount"
                    inputMode="numeric"
                    value={currentHeadcount}
                    onChange={(e) => {
                      const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                      setCurrentHeadcount(Number.isFinite(n) && n >= 0 ? n : 0);
                      setPrintVersion((v) => v + 1);
                    }}
                    className="w-full bg-transparent py-2 text-center font-mono text-ink outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Increase current headcount"
                    onClick={() => {
                      setCurrentHeadcount((n) => n + 1);
                      setPrintVersion((v) => v + 1);
                    }}
                    className="flex h-11 w-9 shrink-0 items-center justify-center text-ink-soft hover:text-ink"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-ink-faint">
              Used only for employer-size rules. The estimate below is for
              one new hire.
            </p>
          </div>

          {/* Benefits toggle */}
          <div className="rounded-sm border border-hairline bg-paper-raised p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-ink">Include benefits</div>
                <p className="mt-0.5 text-xs text-ink-faint">
                  Health insurance, 401(k) match, bonus, and more. Off by
                  default.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={includeBenefits}
                onClick={() => {
                  setIncludeBenefits((v) => !v);
                  setPrintVersion((v) => v + 1);
                }}
                className="flex h-11 w-11 shrink-0 items-center justify-center"
              >
                <span
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    includeBenefits ? "bg-money" : "bg-hairline"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper-raised transition-transform ${
                      includeBenefits ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </span>
              </button>
            </div>

            {includeBenefits && (
              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                  <BenefitField
                    label="Health insurance"
                    suffix="/mo"
                    value={benefits.healthInsuranceMonthly}
                    onChange={(v) => updateBenefit("healthInsuranceMonthly", v)}
                  />
                  <BenefitField
                    label="401(k) match"
                    suffix="% of salary"
                    value={benefits.retirementMatchPercent}
                    onChange={(v) => updateBenefit("retirementMatchPercent", v)}
                    max={100}
                  />
                  <BenefitField
                    label="Bonus"
                    suffix="/yr"
                    value={benefits.bonusAnnual}
                    onChange={(v) => updateBenefit("bonusAnnual", v)}
                  />
                  <BenefitField
                    label="Meals / snacks"
                    suffix="/mo"
                    value={benefits.mealsMonthly}
                    onChange={(v) => updateBenefit("mealsMonthly", v)}
                  />
                  <BenefitField
                    label="Other benefits"
                    suffix="/mo"
                    value={benefits.otherMonthly}
                    onChange={(v) => updateBenefit("otherMonthly", v)}
                  />
                </div>

                <p className="text-xs text-ink-faint">
                  Health insurance defaults to the 2025 KFF national average
                  employer contribution — replace it with your own quote.
                </p>

                <div className="border-t border-hairline-soft pt-5">
                  <label className="mb-1 block text-xs text-ink-soft">
                    Workers&rsquo; compensation
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <select
                      value={benefits.workersCompIndustryKey}
                      onChange={(e) =>
                        updateBenefit("workersCompIndustryKey", e.target.value)
                      }
                      disabled={benefits.workersCompMode === "custom"}
                      className="flex-1 border-b border-hairline bg-transparent py-2.5 text-sm text-ink outline-none focus:border-ink disabled:text-ink-faint"
                    >
                      {WORKERS_COMP_INDUSTRIES.map((i) => (
                        <option key={i.key} value={i.key}>
                          {i.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="-mx-1 mt-1 flex min-h-11 cursor-pointer items-center gap-2 px-1 text-xs text-ink-soft">
                    <input
                      type="checkbox"
                      checked={benefits.workersCompMode === "custom"}
                      onChange={(e) =>
                        updateBenefit(
                          "workersCompMode",
                          e.target.checked ? "custom" : "industry"
                        )
                      }
                      className="h-4 w-4 shrink-0"
                    />
                    I know my own annual premium
                  </label>
                  {benefits.workersCompMode === "custom" && (
                    <div className="mt-2 max-w-[10rem]">
                      <BenefitField
                        label="Annual premium"
                        suffix="/yr"
                        value={benefits.workersCompCustomAnnual}
                        onChange={(v) => updateBenefit("workersCompCustomAnnual", v)}
                      />
                    </div>
                  )}
                  <p className="mt-2 text-xs text-ink-faint">
                    Rough national averages by industry — real premiums
                    depend on your state, class code, and carrier.
                  </p>
                </div>
              </div>
            )}
          </div>

          <DetailAssumptions result={result} />
        </div>

        {/* Receipt */}
        <div ref={receiptRef} className="lg:sticky lg:top-8">
          <Receipt result={result} printKey={printVersion} />
        </div>
      </div>

      <div id="hiring-budget" className="mt-16 scroll-mt-24">
        <HiringBudget
          stateCode={stateCode}
          currentHeadcount={currentHeadcount}
          includeBenefits={includeBenefits}
          benefits={benefits}
        />
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-paper-raised/95 backdrop-blur transition-transform duration-200 lg:hidden ${
          receiptVisible ? "translate-y-full" : "translate-y-0"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-hidden={receiptVisible}
      >
        <button
          type="button"
          onClick={() =>
            receiptRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            })
          }
          className="flex w-full items-center justify-between px-5 py-3"
        >
          <span className="text-xs text-ink-soft">True annual cost</span>
          <span className="font-mono text-lg font-medium text-money">
            {formatCurrency(result.totalAnnualPerEmployee)}
          </span>
        </button>
      </div>
    </div>
  );
}

function BenefitField({
  label,
  suffix,
  value,
  onChange,
  max,
}: {
  label: string;
  suffix: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-ink-soft">{label}</label>
      <div className="flex items-baseline gap-1.5 border-b border-hairline focus-within:border-ink">
        {suffix.startsWith("%") ? null : (
          <span className="font-mono text-base text-ink-faint sm:text-sm">$</span>
        )}
        <input
          inputMode="numeric"
          value={value || ""}
          placeholder="0"
          onChange={(e) => {
            const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
            const clamped = Number.isFinite(n) ? Math.min(n, max ?? Infinity) : 0;
            onChange(clamped);
          }}
          className="w-full bg-transparent py-2 font-mono text-base text-ink outline-none sm:py-1.5 sm:text-sm"
        />
        <span className="shrink-0 whitespace-nowrap font-mono text-xs text-ink-faint">
          {suffix}
        </span>
      </div>
    </div>
  );
}
