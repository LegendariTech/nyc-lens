import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Learn about how BBL Club uses cookies and tracking technologies to improve your experience on our NYC property data platform.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiesPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">Cookie Policy</h1>

      <div className="space-y-6 text-foreground/90 leading-relaxed">
        <p className="text-sm text-foreground/70">
          <strong>Last Updated:</strong> February 17, 2026
        </p>

        <p>
          This Cookie Policy explains how BBL Club ("we," "us," or "our") uses cookies and similar tracking technologies when you visit our website at bblclub.com.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device (computer, tablet, smartphone) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Types of Cookies We Use</h2>

          <div className="space-y-4">
            <div className="p-4 border border-foreground/10 rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-2">2.1 Essential Cookies</h3>
              <p className="mb-2">
                <strong>Purpose:</strong> Required for the website to function properly
              </p>
              <p className="mb-2">
                <strong>Examples:</strong> Session management, security features
              </p>
              <p>
                <strong>Can be disabled:</strong> No (website won't work without them)
              </p>
            </div>

            <div className="p-4 border border-foreground/10 rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-2">2.2 Analytics Cookies</h3>
              <p className="mb-2">
                <strong>Purpose:</strong> Help us understand how visitors use our website
              </p>
              <p className="mb-2">
                <strong>Provider:</strong> Google Analytics 4
              </p>
              <p className="mb-2">
                <strong>Data Collected:</strong> Page views, session duration, bounce rate, user demographics, device info
              </p>
              <p className="mb-2">
                <strong>Cookie Names:</strong> _ga, _ga_*, _gid, _gat
              </p>
              <p>
                <strong>Duration:</strong> Up to 2 years
              </p>
            </div>

            <div className="p-4 border border-foreground/10 rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-2">2.3 Tag Management Cookies</h3>
              <p className="mb-2">
                <strong>Purpose:</strong> Manage tracking scripts and analytics tags
              </p>
              <p className="mb-2">
                <strong>Provider:</strong> Google Tag Manager
              </p>
              <p className="mb-2">
                <strong>Data Collected:</strong> Events, user interactions, custom tracking
              </p>
              <p>
                <strong>Duration:</strong> Session-based
              </p>
            </div>

            <div className="p-4 border border-foreground/10 rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-2">2.4 Performance Monitoring Cookies</h3>
              <p className="mb-2">
                <strong>Purpose:</strong> Monitor website performance and Core Web Vitals
              </p>
              <p className="mb-2">
                <strong>Provider:</strong> Vercel Analytics
              </p>
              <p className="mb-2">
                <strong>Data Collected:</strong> Page load times, LCP, FID, CLS metrics
              </p>
              <p>
                <strong>Duration:</strong> Session-based
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. Third-Party Cookies</h2>
          <p className="mb-3">
            Our website uses cookies from the following third-party services:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border border-foreground/10">
              <thead className="bg-foreground/5">
                <tr>
                  <th className="px-4 py-2 text-left border-b border-foreground/10">Service</th>
                  <th className="px-4 py-2 text-left border-b border-foreground/10">Purpose</th>
                  <th className="px-4 py-2 text-left border-b border-foreground/10">Privacy Policy</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-foreground/10">
                  <td className="px-4 py-2">Google Analytics</td>
                  <td className="px-4 py-2">Website analytics</td>
                  <td className="px-4 py-2">
                    <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      Google Privacy
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-foreground/10">
                  <td className="px-4 py-2">Google Tag Manager</td>
                  <td className="px-4 py-2">Tag management</td>
                  <td className="px-4 py-2">
                    <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      Google Privacy
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-foreground/10">
                  <td className="px-4 py-2">Vercel Analytics</td>
                  <td className="px-4 py-2">Performance monitoring</td>
                  <td className="px-4 py-2">
                    <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      Vercel Privacy
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Mapbox</td>
                  <td className="px-4 py-2">Interactive maps</td>
                  <td className="px-4 py-2">
                    <a href="https://www.mapbox.com/legal/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      Mapbox Privacy
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. How to Control Cookies</h2>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">4.1 Browser Settings</h3>
          <p className="mb-2">
            Most web browsers allow you to control cookies through their settings preferences. You can:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Delete all cookies</li>
            <li>Block all cookies</li>
            <li>Allow only first-party cookies</li>
            <li>Clear cookies when you close your browser</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">4.2 Browser-Specific Instructions</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Chrome:</strong>{' '}
              <a href="https://support.google.com/chrome/answer/95647" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Manage cookies in Chrome
              </a>
            </li>
            <li>
              <strong>Firefox:</strong>{' '}
              <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Manage cookies in Firefox
              </a>
            </li>
            <li>
              <strong>Safari:</strong>{' '}
              <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Manage cookies in Safari
              </a>
            </li>
            <li>
              <strong>Edge:</strong>{' '}
              <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Manage cookies in Edge
              </a>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">4.3 Opt-Out of Google Analytics</h3>
          <p>
            You can opt-out of Google Analytics tracking by installing the{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">4.4 Impact of Disabling Cookies</h3>
          <p>
            Disabling cookies may affect your ability to use certain features of our Service. Essential cookies cannot be disabled without breaking core functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. Do Not Track Signals</h2>
          <p>
            Some browsers include a "Do Not Track" (DNT) feature that signals websites you visit that you do not want your online activity tracked. Currently, there is no industry standard for recognizing DNT signals, and our Service does not respond to DNT browser signals.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. Please review this policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us at:
          </p>
          <div className="mt-3 p-4 bg-foreground/5 rounded-lg">
            <p><strong>Email:</strong> privacy@bblclub.com</p>
            <p className="mt-1"><strong>Website:</strong> https://bblclub.com</p>
          </div>
        </section>

        <section className="mt-12 pt-6 border-t border-foreground/10">
          <p className="text-sm text-foreground/70">
            For more information about your privacy rights, please see our{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </section>
      </div>
      </div>
    </div>
  );
}
