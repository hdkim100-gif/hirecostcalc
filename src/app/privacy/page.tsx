import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What HireCost does and doesn't collect: calculator inputs never leave your device; standard site analytics and advertising cookies are covered here.",
};

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="2026-08-25">
      <p>
        HireCost (&ldquo;we,&rdquo; &ldquo;us&rdquo;) publishes this policy to
        explain what happens to your data when you use{" "}
        <strong>hirecostcalc.com</strong>.
      </p>

      <h2>The calculator itself</h2>
      <p>
        Every number you type into the salary, state, employee count, benefits,
        or hiring-budget fields is calculated <strong>in your browser</strong>.
        None of it is sent to our servers, stored in a database, or attached
        to your identity. There is no account, no sign-up, and no server-side
        record of what you calculated. If you close the tab, it&rsquo;s gone.
      </p>

      <h2>Site analytics</h2>
      <p>
        We use Google Analytics to understand which pages get used and how
        &mdash; aggregate counts of visits, approximate location (country/
        region level), device type, and referring site. This is separate from
        the calculator above: Analytics never sees the salary, state, or
        budget figures you enter, only that a calculator page was viewed.
        Google Analytics sets cookies to distinguish visitors; see{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          Google&rsquo;s Privacy Policy
        </a>{" "}
        for how Google handles that data.
      </p>

      <h2>Advertising</h2>
      <p>
        This site may show ads served by Google AdSense. Google and its
        partners may use cookies to serve ads based on your visits here and
        to other sites, and to measure ad performance. You can review or opt
        out of personalized advertising at{" "}
        <a
          href="https://adssettings.google.com"
          target="_blank"
          rel="noreferrer"
        >
          Google Ads Settings
        </a>
        , and see how Google uses data from sites that use its services at{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noreferrer"
        >
          How Google uses information from partner sites
        </a>
        .
      </p>

      <h2>Cookie choices</h2>
      <p>
        On your first visit, a banner lets you accept or decline non-essential
        cookies (analytics and advertising). Declining disables Google
        Analytics and ad personalization for your visit; the calculator works
        identically either way, since it never depended on cookies to begin
        with. You can change your choice at any time by clearing your
        browser&rsquo;s local storage for this site.
      </p>

      <h2>California and other state privacy rights</h2>
      <p>
        If you&rsquo;re a California resident, you have the right to know
        what personal information is collected and to opt out of its sale or
        sharing. We don&rsquo;t sell personal information. The advertising
        cookies described above may be considered &ldquo;sharing&rdquo; under
        some state laws; declining the cookie banner opts you out of that
        sharing on this site.
      </p>

      <h2>Children</h2>
      <p>
        HireCost is intended for business use and is not directed at children
        under 13. We don&rsquo;t knowingly collect information from children.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, we&rsquo;ll update the date at the top of
        this page.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy: <a href="mailto:contact@hirecostcalc.com">contact@hirecostcalc.com</a>.
      </p>
    </LegalPage>
  );
}
