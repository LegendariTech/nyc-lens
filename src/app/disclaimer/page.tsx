import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important disclaimers about BBL Club NYC property data accuracy, usage, and limitations.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function DisclaimerPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">Disclaimer</h1>

      <div className="space-y-6 text-foreground/90 leading-relaxed">
        <p className="text-sm text-foreground/70">
          <strong>Last Updated:</strong> February 17, 2026
        </p>

        <div className="p-6 bg-amber-500/10 border-2 border-amber-500/30 rounded-lg">
          <p className="font-semibold text-foreground mb-2">PLEASE READ THIS DISCLAIMER CAREFULLY</p>
          <p>
            The information provided on BBL Club is for general informational purposes only. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind about the completeness, accuracy, reliability, or availability of the data.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Data Accuracy</h2>
          <p className="mb-3">
            All property data displayed on BBL Club is sourced from public NYC government databases (ACRIS, PLUTO, DOB, HPD). Despite our best efforts:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Data may contain errors, inaccuracies, or be incomplete</li>
            <li>Data may be outdated or not reflect the most current information</li>
            <li>Government databases may have data entry errors or omissions</li>
            <li>Property records may be pending updates or corrections</li>
            <li>We do not independently verify the accuracy of government data</li>
          </ul>
          <p className="mt-3 font-semibold">
            Always verify critical information with official NYC government sources before making any decisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Not Professional Advice</h2>
          <p className="mb-3">
            The information on BBL Club does NOT constitute:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Legal advice</strong> - Consult a licensed attorney for legal matters</li>
            <li><strong>Financial advice</strong> - Consult a financial advisor for investment decisions</li>
            <li><strong>Real estate advice</strong> - Consult a licensed real estate professional</li>
            <li><strong>Tax advice</strong> - Consult a certified public accountant or tax professional</li>
            <li><strong>Appraisal services</strong> - Consult a licensed property appraiser</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. No Warranty</h2>
          <p>
            THE SERVICE AND ALL DATA ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Warranties of merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement</li>
            <li>Accuracy or completeness</li>
            <li>Uninterrupted or error-free operation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Limitation of Liability</h2>
          <p>
            BBL Club, its owners, employees, and affiliates shall not be liable for any damages arising from:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Reliance on any information displayed on the Service</li>
            <li>Errors, inaccuracies, or omissions in property data</li>
            <li>Financial losses resulting from property transactions</li>
            <li>Legal disputes arising from property ownership or liens</li>
            <li>Business interruptions or lost profits</li>
            <li>Data breaches or unauthorized access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Sources</h2>
          <p className="mb-2">
            Property data is aggregated from the following NYC government sources:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>ACRIS (Automated City Register Information System):</strong> NYC Department of Finance - Property sales, mortgages, and deeds
            </li>
            <li>
              <strong>PLUTO (Primary Land Use Tax Lot Output):</strong> NYC Department of City Planning - Property characteristics and zoning
            </li>
            <li>
              <strong>DOB (Department of Buildings):</strong> Building violations, permits, and job applications
            </li>
            <li>
              <strong>HPD (Housing Preservation & Development):</strong> Housing violations and registrations
            </li>
          </ul>
          <p className="mt-3">
            We are not affiliated with or endorsed by the City of New York or any NYC government agency. For official records, please visit the respective agency websites.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. User Responsibility</h2>
          <p className="mb-2">
            Users of BBL Club are solely responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Verifying data accuracy with official sources before relying on it</li>
            <li>Conducting their own due diligence for property transactions</li>
            <li>Consulting appropriate professionals (attorneys, accountants, appraisers)</li>
            <li>Compliance with all applicable laws when using the data</li>
            <li>Understanding the limitations of public records data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">7. No Endorsement</h2>
          <p>
            The display of property information does not constitute an endorsement, recommendation, or certification of any property, owner, or transaction. We do not evaluate properties or provide opinions about property value, condition, or suitability.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">8. Fair Housing Statement</h2>
          <p>
            BBL Club supports fair housing practices and is committed to compliance with federal, state, and local fair housing laws. Property data is displayed without discrimination based on race, color, religion, sex, handicap, familial status, national origin, or any other protected class.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">9. External Links</h2>
          <p>
            Our Service may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of these external sites. Links are provided for convenience only and do not imply endorsement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to Data</h2>
          <p>
            Property data is updated periodically based on NYC government database updates. We do not guarantee real-time accuracy. There may be delays between official record updates and their appearance on our Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">11. Privacy and Personal Information</h2>
          <p>
            While BBL Club displays public property ownership information, we recognize that some individuals may have privacy concerns. Property owner information displayed on our Service is publicly available through NYC government sources. If you have concerns about your personal information appearing in public records, please contact the relevant NYC agency.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">12. Contact Information</h2>
          <p>
            If you have questions about this disclaimer or the data displayed on our Service, please contact us at:
          </p>
          <div className="mt-3 p-4 bg-foreground/5 rounded-lg">
            <p><strong>Email:</strong> info@bblclub.com</p>
            <p className="mt-1"><strong>Website:</strong> https://bblclub.com</p>
          </div>
        </section>

        <section className="mt-12 pt-6 border-t border-foreground/10">
          <p className="text-sm text-foreground/70">
            By using BBL Club, you acknowledge that you have read, understood, and agree to this Disclaimer. If you do not agree, please do not use our Service.
          </p>
        </section>
      </div>
      </div>
    </div>
  );
}
