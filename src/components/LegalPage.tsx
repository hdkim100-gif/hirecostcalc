export default function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <p className="text-xs uppercase tracking-widest text-cost">{eyebrow}</p>
      <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-ink-faint">Last updated {updated}</p>
      <div className="prose-legal mt-10 space-y-6 text-sm leading-relaxed text-ink-soft [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-lg [&_h2]:text-ink [&_h2]:first:mt-0 [&_a]:text-money [&_a]:underline [&_a]:decoration-hairline [&_a]:underline-offset-2 hover:[&_a]:decoration-money [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
