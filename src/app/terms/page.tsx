import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'BBL Club Terms of Service. Review the terms and conditions for using our NYC property data platform.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>

      <div className="space-y-6 text-foreground/90 leading-relaxed">
        <p className="text-sm text-foreground/70">
          <strong>Last Updated:</strong> February 17, 2026
        </p>

        <p>
          Please read these Terms of Service ("Terms") carefully before using BBL Club (the "Service") operated by BBL Club ("us", "we", or "our").
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
          <p>
            BBL Club provides access to aggregated public NYC property data from various government sources including ACRIS, PLUTO, Department of Buildings (DOB), and Housing Preservation & Development (HPD). The Service allows users to search, view, and analyze property information for research and informational purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. Data Accuracy Disclaimer</h2>
          <p className="mb-3">
            <strong>IMPORTANT:</strong> All property data is sourced from public NYC government databases. While we strive for accuracy:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Data may contain errors, omissions, or be outdated</li>
            <li>We do not verify, guarantee, or warrant the accuracy of any data</li>
            <li>Data is provided "AS IS" without warranties of any kind</li>
            <li>Users should verify critical information with official sources</li>
            <li>We are not responsible for decisions made based on this data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Not Legal or Financial Advice</h2>
          <p>
            The information provided through the Service is for informational purposes only and does not constitute legal, financial, tax, or professional advice. You should consult with qualified professionals before making any decisions based on data from this Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. Acceptable Use</h2>
          <p className="mb-3">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Scrape, crawl, or harvest data through automated means without permission</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Use data to harass, stalk, or harm individuals</li>
            <li>Misrepresent data or your affiliation with any entity</li>
            <li>Resell or commercially exploit the data without authorization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. Intellectual Property</h2>
          <p className="mb-3">
            The Service and its original content (excluding public government data), features, and functionality are owned by BBL Club and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            Public government data (ACRIS, PLUTO, DOB, HPD) remains the property of the City of New York and is subject to NYC Open Data Terms of Use.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, BBL CLUB SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Your use or inability to use the Service</li>
            <li>Any inaccuracy, error, or omission in property data</li>
            <li>Any decisions made based on data from the Service</li>
            <li>Unauthorized access to or alteration of your data</li>
            <li>Any third-party conduct or content on the Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">8. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless BBL Club and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising from your use of the Service or violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">9. Third-Party Services</h2>
          <p className="mb-2">The Service integrates with third-party services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Google Analytics & Tag Manager:</strong> Subject to Google's Privacy Policy</li>
            <li><strong>Mapbox:</strong> Subject to Mapbox's Privacy Policy and Terms of Service</li>
            <li><strong>Vercel:</strong> Subject to Vercel's Privacy Policy</li>
          </ul>
          <p className="mt-3">
            We are not responsible for the privacy practices or content of these third-party services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">10. Data Attribution</h2>
          <p>
            Property data is sourced from NYC Open Data and is subject to NYC's Terms of Use. Users must comply with NYC Open Data license terms when using this data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">11. Service Availability</h2>
          <p>
            We do not guarantee that the Service will be available at all times or that it will be error-free. We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">12. Termination</h2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">13. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">14. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. Material changes will be notified by updating the "Last Updated" date. Your continued use of the Service after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">15. Contact Information</h2>
          <p>
            If you have questions about these Terms, please contact us at:
          </p>
          <div className="mt-3 p-4 bg-foreground/5 rounded-lg">
            <p><strong>Email:</strong> legal@bblclub.com</p>
            <p className="mt-1"><strong>Website:</strong> https://bblclub.com</p>
          </div>
        </section>

        <section className="mt-12 pt-6 border-t border-foreground/10">
          <p className="text-sm text-foreground/70">
            These terms of service are provided as a template and should be reviewed by a qualified attorney to ensure compliance with applicable laws and your specific business needs.
          </p>
        </section>
      </div>
    </div>
  );
}
