"use client";

import { useMemo, useState } from "react";
import { solveAffordableSalary, type BenefitsInput } from "@/lib/calculate";
import { formatCurrency } from "@/lib/format";

export default function HiringBudget({
  stateCode,
  currentHeadcount,
  includeBenefits,
  benefits,
}: {
  stateCode: string;
  currentHeadcount: number;
  includeBenefits: boolean;
  benefits: BenefitsInput;
}) {
  const [budgetInput, setBudgetInput] = useState("7000");
  const monthlyBudget = Number(budgetInput.replace(/[^0-9]/g, "") || "0");

  const affordableSalary = useMemo(
    () =>
      solveAffordableSalary(
        monthlyBudget,
        stateCode,
        currentHeadcount,
        includeBenefits,
        benefits
      ),
    [monthlyBudget, stateCode, currentHeadcount, includeBenefits, benefits]
  );

  return (
    <div className="grid gap-8 rounded-sm border border-hairline bg-paper-raised p-6 sm:p-8 lg:grid-cols-2 lg:items-center lg:gap-12">
      <div>
        <p className="text-xs uppercase tracking-widest text-ink-faint">
          Reverse the question
        </p>
        <h2 className="mt-2 font-display text-2xl text-ink">
          Not &ldquo;what will it cost?&rdquo; &mdash;{" "}
          <span className="italic">what can I afford?</span>
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          Enter what your business can put toward one new hire each month,
          all-in. We&rsquo;ll work backward through {stateCode} payroll taxes
          {includeBenefits ? " and your benefits" : ""} to the highest salary
          it supports.
        </p>

        <div className="mt-6 max-w-xs">
          <label htmlFor="budget" className="mb-1.5 block text-sm text-ink-soft">
            Monthly hiring budget
          </label>
          <div className="flex items-center border-b border-hairline focus-within:border-ink">
            <span className="font-mono text-xl text-ink-faint">$</span>
            <input
              id="budget"
              inputMode="numeric"
              value={Number(budgetInput.replace(/[^0-9]/g, "") || "0").toLocaleString("en-US")}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-full bg-transparent py-2 pl-2 font-mono text-xl font-medium text-ink outline-none"
            />
            <span className="font-mono text-sm text-ink-faint">/mo</span>
          </div>
        </div>
      </div>

      <div className="tape-edge bg-money-tint px-6 py-8 text-center sm:px-10">
        <p className="text-xs uppercase tracking-widest text-money-deep">
          Estimated affordable salary
        </p>
        <p className="mt-2 font-mono text-4xl font-medium text-money sm:text-5xl">
          {formatCurrency(affordableSalary)}
        </p>
        <p className="mt-1 text-sm text-ink-soft">per year</p>
      </div>
    </div>
  );
}
