import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms for using the HireCost employee cost calculator, including the limits of what its estimates mean.",
};

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Service" updated="2026-08-25">
      <p>
        By using hirecost.example.com (&ldquo;HireCost,&rdquo; &ldquo;the
        site&rdquo;), you agree to the terms below. Replace this domain with
        your live one before publishing.
      </p>

      <h2>Estimates only</h2>
      <p>
        HireCost calculates <strong>estimates</strong> of employer payroll
        costs using published federal and state tax-year rates. It does not
        provide tax, payroll, legal, or accounting advice, and its output is
        not a substitute for a quote from a payroll provider, accountant, or
        your state&rsquo;s labor department. Actual costs can differ based on
        your business&rsquo;s unemployment insurance experience rating,
        local taxes, benefit plan specifics, and rate changes that occur
        after a given tax year&rsquo;s data was published.
      </p>

      <h2>No warranty</h2>
      <p>
        The site and its calculations are provided &ldquo;as is,&rdquo;
        without warranty of any kind, express or implied, including
        accuracy, completeness, or fitness for a particular purpose. Tax
        rates change; we aim to keep the underlying data current for each
        published tax year but make no guarantee that every figure reflects
        the latest rule in every jurisdiction at every moment.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, HireCost and its operators
        are not liable for any decision made, or loss incurred, in reliance
        on figures produced by this calculator.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Don&rsquo;t attempt to disrupt the site, scrape it at a rate that
        degrades it for other users, or misrepresent its estimates as an
        official government or payroll-provider quote.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms as the site changes; the date at the top
        of this page reflects the latest revision.
      </p>

      <h2>Contact</h2>
      <p>
        <a href="mailto:hello@hirecost.example.com">hello@hirecost.example.com</a>
      </p>
    </LegalPage>
  );
}
