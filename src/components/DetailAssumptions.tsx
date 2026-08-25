import type { CalculationResult } from "@/lib/calculate";

export default function DetailAssumptions({
  result,
}: {
  result: CalculationResult;
}) {
  const benefitNotes = result.benefitLines.filter((l) => l.note);

  return (
    <details className="group rounded-sm border border-hairline bg-paper-raised p-6 sm:p-8">
      <summary className="cursor-pointer list-none text-sm text-ink-soft marker:content-none">
        <span className="inline-flex items-center gap-2">
          <span className="text-ink">
            {result.taxYear} calculation assumptions
          </span>
          <span className="text-ink-faint transition-transform group-open:rotate-180">
            &#9662;
          </span>
        </span>
      </summary>

      <div className="mt-5 space-y-4 text-sm">
        <div>
          <div className="text-ink">Mandatory costs &amp; sources</div>
          <div className="mt-3 space-y-3">
            {result.mandatoryLines.map((l) => (
              <div key={l.key} className="border-t border-hairline-soft pt-3 first:border-t-0 first:pt-0">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-ink">{l.label}</span>
                  {l.rateLabel && (
                    <span className="shrink-0 font-mono text-xs text-ink-faint">
                      {l.rateLabel}
                    </span>
                  )}
                </div>
                {l.note && <p className="mt-1 text-ink-soft">{l.note}</p>}
                {l.source && (
                  <p className="mt-1 text-xs text-ink-faint">
                    Source: {l.source}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {benefitNotes.length > 0 && (
          <div className="border-t border-hairline-soft pt-3">
            <div className="text-ink">Optional benefit estimates</div>
            <div className="mt-3 space-y-3">
              {benefitNotes.map((l) => (
                <div key={l.key}>
                  <div className="text-ink">{l.label}</div>
                  <p className="mt-1 text-ink-soft">{l.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-hairline-soft pt-3">
          <div className="text-ink">Assumed for this calculation</div>
          <p className="mt-1 text-ink-soft">
            This estimate assumes your business is a new employer (not yet
            experience-rated) for unemployment insurance purposes. An
            established business&rsquo;s actual SUI rate may be higher or
            lower depending on its claims history. &ldquo;Current
            employees&rdquo; is used only to check headcount-based
            thresholds (paid sick leave tiers, the ACA&rsquo;s 50-employee
            mark) — it doesn&rsquo;t change the tax rates themselves.
          </p>
        </div>
      </div>
    </details>
  );
}
