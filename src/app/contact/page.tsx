import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with BBL Club. Contact us for questions, feedback, data corrections, or privacy requests.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">Contact Us</h1>

      <div className="space-y-8 text-foreground/90 leading-relaxed">
        <p className="text-lg">
          Have questions, feedback, or need assistance? We're here to help. Please reach out using the contact information below.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">General Inquiries</h2>
          <div className="p-6 bg-foreground/5 rounded-lg border border-foreground/10">
            <p className="mb-2"><strong>Email:</strong> <a href="mailto:info@bblclub.com" className="text-blue-600 hover:underline">info@bblclub.com</a></p>
            <p><strong>Website:</strong> <a href="https://bblclub.com" className="text-blue-600 hover:underline">https://bblclub.com</a></p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Specific Contact Purposes</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border border-foreground/10 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Privacy & Data Requests</h3>
              <p className="text-sm mb-2">GDPR, CCPA requests, data deletion, privacy questions</p>
              <p className="text-sm">
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@bblclub.com" className="text-blue-600 hover:underline">
                  privacy@bblclub.com
                </a>
              </p>
            </div>

            <div className="p-4 border border-foreground/10 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Legal & Terms</h3>
              <p className="text-sm mb-2">Legal questions, terms clarifications, compliance</p>
              <p className="text-sm">
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@bblclub.com" className="text-blue-600 hover:underline">
                  legal@bblclub.com
                </a>
              </p>
            </div>

            <div className="p-4 border border-foreground/10 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Data Corrections</h3>
              <p className="text-sm mb-2">Report data errors, inaccuracies, or issues</p>
              <p className="text-sm">
                <strong>Email:</strong>{' '}
                <a href="mailto:data@bblclub.com" className="text-blue-600 hover:underline">
                  data@bblclub.com
                </a>
              </p>
              <p className="text-xs text-foreground/70 mt-2">
                Note: We display public data from NYC agencies. For official corrections, contact the source agency directly.
              </p>
            </div>

            <div className="p-4 border border-foreground/10 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Technical Support</h3>
              <p className="text-sm mb-2">Bug reports, technical issues, feature requests</p>
              <p className="text-sm">
                <strong>Email:</strong>{' '}
                <a href="mailto:support@bblclub.com" className="text-blue-600 hover:underline">
                  support@bblclub.com
                </a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Data Source Contacts</h2>
          <p className="mb-3">
            For official property records and corrections, please contact NYC government agencies directly:
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-foreground/5 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">ACRIS - Property Sales & Mortgages</h3>
              <p className="text-sm mb-1">
                <strong>Website:</strong>{' '}
                <a href="https://a836-acris.nyc.gov" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  a836-acris.nyc.gov
                </a>
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> NYC Department of Finance - (212) 639-9675
              </p>
            </div>

            <div className="p-4 bg-foreground/5 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">DOB - Building Violations & Permits</h3>
              <p className="text-sm mb-1">
                <strong>Website:</strong>{' '}
                <a href="https://www.nyc.gov/buildings" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  nyc.gov/buildings
                </a>
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> NYC Department of Buildings - (212) 566-5000
              </p>
            </div>

            <div className="p-4 bg-foreground/5 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">HPD - Housing Violations & Complaints</h3>
              <p className="text-sm mb-1">
                <strong>Website:</strong>{' '}
                <a href="https://www.nyc.gov/hpd" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  nyc.gov/hpd
                </a>
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> NYC HPD Infoline - (212) 863-7611
              </p>
            </div>

            <div className="p-4 bg-foreground/5 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">PLUTO - Property Characteristics</h3>
              <p className="text-sm mb-1">
                <strong>Website:</strong>{' '}
                <a href="https://www.nyc.gov/planning" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  nyc.gov/planning
                </a>
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> NYC Planning - (212) 720-3300
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Response Time</h2>
          <p>
            We strive to respond to all inquiries within 2-3 business days. Privacy requests under GDPR or CCPA will be addressed within the legally required timeframe (typically 30 days).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Business Hours</h2>
          <p>
            Monday - Friday: 9:00 AM - 6:00 PM EST<br />
            Saturday - Sunday: Closed
          </p>
          <p className="text-sm text-foreground/70 mt-2">
            Email inquiries are monitored during business hours. We will respond as quickly as possible.
          </p>
        </section>

        <section className="mt-12 pt-6 border-t border-foreground/10">
          <p className="text-sm text-foreground/70">
            For more information, please review our{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>,{' '}
            <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>, and{' '}
            <a href="/disclaimer" className="text-blue-600 hover:underline">Disclaimer</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
