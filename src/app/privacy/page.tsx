import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'BBL Club privacy policy. Learn how we collect, use, and protect your information when you use our NYC property data platform.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

      <div className="space-y-6 text-foreground/90 leading-relaxed">
        <p className="text-sm text-foreground/70">
          <strong>Last Updated:</strong> February 17, 2026
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
          <p>
            BBL Club ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website bblclub.com and use our NYC property data services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">2.1 Automatically Collected Information</h3>
          <p className="mb-2">When you visit our website, we automatically collect certain information about your device and browsing activity:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Usage Data:</strong> Pages visited, time spent, links clicked, search queries</li>
            <li><strong>Device Information:</strong> Browser type, operating system, device type, IP address</li>
            <li><strong>Location Data:</strong> General geographic location (city/region level)</li>
            <li><strong>Analytics Data:</strong> Collected via Google Analytics 4 and Google Tag Manager</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">2.2 Cookies and Tracking Technologies</h3>
          <p className="mb-2">We use cookies and similar tracking technologies to enhance your experience:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Google Analytics:</strong> Website analytics and performance tracking</li>
            <li><strong>Google Tag Manager:</strong> Tag management and event tracking</li>
            <li><strong>Vercel Analytics:</strong> Performance monitoring and web vitals</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">2.3 Information You Provide</h3>
          <p>We do not currently collect personal information directly from users. All property data displayed is sourced from public NYC government databases.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
          <p className="mb-2">We use the collected information for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Providing and improving our property data search services</li>
            <li>Analyzing website usage and performance metrics</li>
            <li>Understanding user behavior to enhance user experience</li>
            <li>Detecting and preventing technical issues</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Sharing and Disclosure</h2>
          <p className="mb-2">We share your information with the following third parties:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Google LLC:</strong> Analytics and tracking (Google Analytics, Tag Manager)</li>
            <li><strong>Vercel Inc:</strong> Hosting and analytics services</li>
            <li><strong>Mapbox Inc:</strong> Interactive map services</li>
          </ul>
          <p className="mt-3">
            We do not sell your personal information to third parties. We may disclose information if required by law or to protect our legal rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Sources</h2>
          <p className="mb-2">All property data displayed on BBL Club is sourced from public NYC government databases:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>ACRIS:</strong> NYC Department of Finance (property transactions, deeds, mortgages)</li>
            <li><strong>PLUTO:</strong> NYC Department of City Planning (property characteristics)</li>
            <li><strong>DOB:</strong> NYC Department of Buildings (violations, permits, jobs)</li>
            <li><strong>HPD:</strong> NYC Housing Preservation & Development (violations, registrations)</li>
          </ul>
          <p className="mt-3">
            This data is publicly available and not subject to privacy protections. We aggregate and present it for informational purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Privacy Rights</h2>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">6.1 GDPR Rights (EU Users)</h3>
          <p className="mb-2">If you are in the European Economic Area, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access your personal data</li>
            <li>Rectify inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing</li>
            <li>Data portability</li>
            <li>Withdraw consent</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">6.2 CCPA Rights (California Users)</h3>
          <p className="mb-2">If you are a California resident, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Know what personal information is collected</li>
            <li>Know if personal information is sold or shared</li>
            <li>Opt-out of the sale of personal information</li>
            <li>Request deletion of personal information</li>
            <li>Non-discrimination for exercising privacy rights</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">6.3 Cookie Control</h3>
          <p>
            You can control cookies through your browser settings. Note that disabling cookies may limit functionality. To opt-out of Google Analytics tracking, visit:{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Google Analytics Opt-out
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">7. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your information, including HTTPS encryption, security headers (HSTS, CSP, XFO), and secure data transmission protocols. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">8. Data Retention</h2>
          <p>
            We retain analytics data for 26 months (Google Analytics default). Server logs are retained for 90 days. You can request deletion of your data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">9. Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">10. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in the United States and other countries where our service providers operate. By using our services, you consent to such transfers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">12. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us at:
          </p>
          <div className="mt-3 p-4 bg-foreground/5 rounded-lg">
            <p><strong>Email:</strong> privacy@bblclub.com</p>
            <p className="mt-1"><strong>Website:</strong> https://bblclub.com</p>
          </div>
        </section>

        <section className="mt-12 pt-6 border-t border-foreground/10">
          <p className="text-sm text-foreground/70">
            This privacy policy is provided for informational purposes and should be reviewed by a qualified attorney to ensure compliance with applicable laws.
          </p>
        </section>
      </div>
    </div>
  );
}
