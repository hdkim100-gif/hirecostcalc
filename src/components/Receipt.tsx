"use client";

import type { CalculationResult, LineItem } from "@/lib/calculate";
import { formatCurrency } from "@/lib/format";

function Line({
  item,
  index,
  tone = "cost",
}: {
  item: LineItem;
  index: number;
  tone?: "cost" | "ink";
}) {
  return (
    <div
      className="receipt-line py-1.5 text-sm"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <div className="truncate text-ink">{item.label}</div>
          {item.rateLabel && (
            <div className="text-xs text-ink-faint">{item.rateLabel}</div>
          )}
        </div>
        <div
          className={`shrink-0 font-mono font-tabular ${
            tone === "cost" ? "text-cost" : "text-ink"
          }`}
        >
          +{formatCurrency(item.annualPerEmployee)}
        </div>
      </div>
      {item.shortNote && (
        <p className="mt-1 text-xs leading-relaxed text-cost">{item.shortNote}</p>
      )}
    </div>
  );
}

export default function Receipt({
  result,
  printKey,
}: {
  result: CalculationResult;
  printKey: string | number;
}) {
  const lineCount = result.mandatoryLines.length + result.benefitLines.length;

  return (
    <div key={printKey} className="receipt px-6 py-8 sm:px-8 sm:py-10">
      <div
        className="receipt-line mb-5 flex items-baseline justify-between font-mono text-xs uppercase tracking-widest text-ink-faint"
        style={{ animationDelay: "0ms" }}
      >
        <span>HireCost &middot; {result.taxYear} estimate</span>
        <span>{result.stateName}</span>
      </div>

      <div
        className="receipt-line flex items-start justify-between gap-3 py-1.5"
        style={{ animationDelay: "40ms" }}
      >
        <div className="text-ink">Employee #{result.headcountAfterHire} salary</div>
        <div className="shrink-0 font-mono font-tabular text-ink">
          {formatCurrency(result.baseSalaryAnnual)}
        </div>
      </div>

      <div className="receipt-rule my-2" />

      <div className="mb-1 mt-3 text-xs uppercase tracking-wide text-ink-faint">
        Mandatory employer costs
      </div>
      {result.mandatoryLines.map((item, i) => (
        <Line item={item} index={i + 2} key={item.key} />
      ))}

      {result.benefitLines.length > 0 && (
        <>
          <div className="receipt-rule my-2" />
          <div className="mb-1 mt-3 text-xs uppercase tracking-wide text-ink-faint">
            Optional benefits
          </div>
          {result.benefitLines.map((item, i) => (
            <Line
              item={item}
              index={i + 2 + result.mandatoryLines.length}
              key={item.key}
            />
          ))}
        </>
      )}

      <div className="receipt-rule-double mt-4 pt-4">
        <div
          className="receipt-line flex items-baseline justify-between"
          style={{ animationDelay: `${(lineCount + 2) * 55}ms` }}
        >
          <div className="font-display text-lg text-ink">True Annual Cost</div>
          <div className="font-mono font-tabular text-2xl font-medium text-money">
            {formatCurrency(result.totalAnnualPerEmployee)}
          </div>
        </div>
        <div
          className="receipt-line mt-1 flex items-baseline justify-between text-sm text-ink-soft"
          style={{ animationDelay: `${(lineCount + 3) * 55}ms` }}
        >
          <div>
            {result.multiplierOfSalary.toFixed(2)}&times; the salary alone
          </div>
          <div className="font-mono font-tabular">
            {formatCurrency(result.totalMonthlyPerEmployee)}/mo
          </div>
        </div>
      </div>

      {result.paidSickLeave && (
        <div
          className="receipt-line mt-6 border border-hairline px-4 py-3 text-xs leading-relaxed"
          style={{ animationDelay: `${(lineCount + 4) * 55}ms` }}
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-ink">{result.paidSickLeave.label}</span>
            <span className="shrink-0 font-mono text-ink-soft">
              {result.paidSickLeave.hoursLabel}
            </span>
          </div>
          <div className="mt-1 text-ink-soft">
            Approx. wage value:{" "}
            <span className="font-mono">
              {formatCurrency(result.paidSickLeave.annualValue)}
            </span>{" "}
            &mdash; not included in True Annual Cost
          </div>
          {result.paidSickLeave.note && (
            <p className="mt-1.5 text-ink-faint">{result.paidSickLeave.note}</p>
          )}
          {result.paidSickLeave.source && (
            <p className="mt-1 text-ink-faint">
              Source: {result.paidSickLeave.source}
            </p>
          )}
        </div>
      )}

      {result.thresholdNote && (
        <div
          className="receipt-line tape-edge -mx-6 mt-6 bg-cost-tint px-6 pb-4 pt-4 text-xs leading-relaxed text-ink-soft sm:-mx-8 sm:px-8"
          style={{ animationDelay: `${(lineCount + 5) * 55}ms` }}
        >
          {result.thresholdNote}
        </div>
      )}
    </div>
  );
}
