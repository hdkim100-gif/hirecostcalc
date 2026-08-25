import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why HireCost exists: a free calculator that shows small business owners the true, fully-loaded cost of hiring an employee in the US.",
};

export default function AboutPage() {
  return (
    <LegalPage eyebrow="About" title="Why HireCost exists" updated="2026-08-25">
      <p>
        Most calculators aimed at hiring in the US answer the employee&rsquo;s
        question: what will I take home? HireCost answers the other side of
        that same transaction &mdash; what does this hire actually cost the
        business, once payroll taxes and benefits are added to the salary
        offered.
      </p>
      <p>
        That number is bigger than the salary alone, and by how much depends
        on the state, the benefits offered, and how many people you&rsquo;re
        hiring. Most owners find that out after the fact, from a payroll
        statement. HireCost is built to answer it before you make the offer.
      </p>

      <h2>What it is</h2>
      <p>
        A calculator for small business owners, startup founders, and
        payroll/HR staff who need a fast, specific answer to &ldquo;can I
        afford this hire?&rdquo; &mdash; not a payroll platform, and not a
        lead form for one. The <Link href="/#calculator">calculator</Link> runs
        entirely in your browser; see the <Link href="/privacy">Privacy</Link> page
        for exactly what that means.
      </p>

      <h2>What it isn&rsquo;t</h2>
      <p>
        HireCost doesn&rsquo;t file payroll, run benefits enrollment, or
        replace an accountant. It estimates mandatory employer payroll taxes
        (Social Security, Medicare, FUTA, state unemployment insurance) and
        whatever optional benefits you enter, using published 2026 tax-year
        rates. See <Link href="/terms">Terms</Link> for the full disclaimer.
      </p>

      <h2>Get in touch</h2>
      <p>
        Found a rate that looks wrong, or a state you&rsquo;d like added?
        Email <a href="mailto:hello@hirecost.example.com">hello@hirecost.example.com</a>.
      </p>
    </LegalPage>
  );
}
