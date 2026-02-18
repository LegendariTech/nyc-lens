import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-foreground/10 bg-background mt-16">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">BBL Club</h3>
            <p className="text-sm text-foreground/70">
              NYC real estate data explorer. Access comprehensive property records, transactions, and building information.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search" className="text-foreground/70 hover:text-foreground hover:underline">
                  Property Search
                </Link>
              </li>
              <li>
                <Link href="/bulk-search" className="text-foreground/70 hover:text-foreground hover:underline">
                  Bulk Search
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-foreground/70 hover:text-foreground hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/70 hover:text-foreground hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Data Sources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://a836-acris.nyc.gov"
                  className="text-foreground/70 hover:text-foreground hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NYC ACRIS
                </a>
              </li>
              <li>
                <a
                  href="https://www.nyc.gov/site/planning/data-maps/open-data.page"
                  className="text-foreground/70 hover:text-foreground hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NYC PLUTO
                </a>
              </li>
              <li>
                <a
                  href="https://www.nyc.gov/buildings"
                  className="text-foreground/70 hover:text-foreground hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NYC DOB
                </a>
              </li>
              <li>
                <a
                  href="https://www.nyc.gov/hpd"
                  className="text-foreground/70 hover:text-foreground hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NYC HPD
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-foreground/70 hover:text-foreground hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-foreground/70 hover:text-foreground hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-foreground/70 hover:text-foreground hover:underline">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-foreground/70 hover:text-foreground hover:underline">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground/70">
            <p>
              © {currentYear} BBL Club. All rights reserved.
            </p>
            <p className="text-center md:text-right">
              Data sourced from NYC Open Data. Not affiliated with the City of New York.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
