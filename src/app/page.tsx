import Link from "next/link";
import { SearchIcon, TableIcon } from "@/components/icons";
import { Footer } from "@/components/layout/Footer";
import { ScreenshotDialog } from "@/components/products/ScreenshotDialog";

export default function Home() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex min-h-full flex-col">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 py-16 md:py-24 bg-gradient-to-b from-background via-blue-500/5 to-background">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400 bg-clip-text text-transparent md:text-5xl lg:text-6xl">
            BBL Club
          </h1>
          <p className="mt-4 text-2xl font-medium bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent md:text-3xl">
            NYC Real Estate Data, Transparent & Real-Time
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/70 md:text-xl">
            Search the latest NYC property transactions, mortgages, and deeds in real-time.
            Uncover the true owners behind LLCs and access comprehensive tax and building information.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <SearchIcon className="h-5 w-5" />
              Start Searching
            </Link>
            <Link
              href="/bulk-search"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-blue-500/30 bg-blue-500/5 px-8 py-4 text-base font-semibold text-foreground backdrop-blur-sm transition-all hover:border-blue-500/50 hover:bg-blue-500/10 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <TableIcon className="h-5 w-5" />
              Bulk Search
            </Link>
          </div>
        </div>
      </div>

      {/* Products Showcase Section */}
      <div className="border-t border-foreground/10 bg-foreground/[0.02] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Powerful Tools for NYC Real Estate Research
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Access comprehensive property data from multiple official sources, all in one place
            </p>
          </div>

          {/* Product Sections */}
          <div className="space-y-24">
            {/* Product 1: Property Overview */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Comprehensive Property Snapshots
                </h3>
                <p className="text-lg text-foreground/80 mb-6">
                  Get a complete property overview aggregated from multiple official sources.
                  Our intelligent data fusion combines ACRIS, PLUTO, tax records, and building
                  data to provide the most valuable information in a single, easy-to-scan view.
                </p>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Building characteristics, zoning, and construction details</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Current ownership, sales history, and mortgage information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Tax assessments, valuations, and exemptions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Interactive parcel map with location context</span>
                  </li>
                </ul>
              </div>
              <ScreenshotDialog
                src="/screenshots/overview.png"
                alt="Property overview panel showing building details, ownership, tax assessment, and contacts for 7 Leroy Street including interactive map and comprehensive data cards"
                title="Property Overview"
              />
            </div>

            {/* Product 2: Owner Intelligence */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <ScreenshotDialog
                  src="/screenshots/contacts.png"
                  alt="Contacts page revealing unmasked owners extracted from mortgage documents with phone numbers and addresses, aggregated from HPD, tax records, and ACRIS databases"
                  title="Owner Intelligence"
                />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Unmasked Owner Intelligence
                </h3>
                <p className="text-lg text-foreground/80 mb-6">
                  Powered by advanced AI research, we extract and reveal the real individuals
                  behind LLCs and corporate entities. Our system aggregates owner contacts from
                  multiple authoritative sources including HPD registrations, tax owner records,
                  and signatories on mortgage and deed documents.
                </p>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Extract signatories from mortgage and deed documents</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Aggregate contacts from HPD, DOB, and tax owner databases</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Direct phone numbers and mailing addresses when available</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Track ownership changes and contact history over time</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Product 3: Transaction Tracking */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Real-Time ACRIS Transaction Data
                </h3>
                <p className="text-lg text-foreground/80 mb-6">
                  Access every ACRIS document with comprehensive, real-time data presented
                  through an extremely user-friendly interface. Track mortgages, deeds,
                  assignments, and liens as they&apos;re recorded by NYC with complete party
                  information and document details.
                </p>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete transaction history with visual timeline</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Filter by document type: deeds, mortgages, UCC filings, and more</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>View full party details including addresses and roles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Direct links to official ACRIS document images</span>
                  </li>
                </ul>
              </div>
              <ScreenshotDialog
                src="/screenshots/transactions.png"
                alt="Interactive transaction timeline with filtering showing deeds, mortgages, and assignments for 7 Leroy Street with complete party details and document links"
                title="Transaction Tracking"
              />
            </div>

            {/* Product 4: Tax Information */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <ScreenshotDialog
                  src="/screenshots/tax.png"
                  alt="Comprehensive tax assessment panel showing market value, assessed value, transitional values, exemptions, and year-over-year tax changes with trend analysis"
                  title="Tax Assessment Data"
                />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Comprehensive Tax Assessment Data
                </h3>
                <p className="text-lg text-foreground/80 mb-6">
                  Access detailed tax information including market value, assessed value,
                  transitional values, and exemptions. Track year-over-year changes to
                  identify trends in property taxation and understand the complete tax burden
                  for any NYC property.
                </p>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Market value, assessed value, and transitional assessments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Tax exemptions and abatements tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Year-over-year change analysis with trend indicators</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Multi-year historical tax assessment data</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Product 5: Bulk Search */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  High-Performance Bulk Search
                </h3>
                <p className="text-lg text-foreground/80 mb-6">
                  Experience blazing-fast bulk search that lets you explore the most recent
                  transactions and mortgages across NYC. Updated daily with the latest data,
                  our comprehensive filtering and sorting system delivers instant results
                  even when searching through millions of records.
                </p>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-indigo-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Daily updates with the latest ACRIS transactions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-indigo-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced filtering by amount, date, borough, building class, and owner</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-indigo-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Instant sorting and pagination through massive datasets</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-indigo-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Export and analyze trends across thousands of properties</span>
                  </li>
                </ul>
              </div>
              <ScreenshotDialog
                src="/screenshots/bulk.png"
                alt="Bulk search interface showing advanced filtering and sorting options for NYC property transactions with real-time data updates and instant performance"
                title="Bulk Search"
              />
            </div>

            {/* Product 6: AI-Optimized Data */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <ScreenshotDialog
                  src="/screenshots/ai.png"
                  alt="AI-optimized data page designed for LLM collaboration with ChatGPT and Claude, providing structured property information for enhanced AI-powered research"
                  title="AI-Powered Research"
                />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  AI-Powered Research Assistant
                </h3>
                <p className="text-lg text-foreground/80 mb-6">
                  Our platform includes AI-optimized pages designed specifically for large language
                  models like ChatGPT and Claude. Simply click &quot;Ask AI&quot; to instantly
                  collaborate with your preferred AI assistant, giving it access to all property
                  data to empower your research with intelligent insights and analysis.
                </p>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-purple-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Structured data optimized for ChatGPT, Claude, and Perplexity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-purple-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>One-click AI assistant integration from any property page</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-purple-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete property context automatically shared with AI</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-purple-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Enhanced research capabilities with AI-powered analysis</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Product 7: Smart Autocomplete Search */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Intelligent Autocomplete Search
                </h3>
                <p className="text-lg text-foreground/80 mb-6">
                  Experience our powerful and extremely fast autocomplete search that understands
                  both BBL (Borough-Block-Lot) and street addresses. Our smart search is aware of
                  alternative addresses (AKAs) and provides instant property previews with
                  transaction and ownership information right in the suggestions dropdown.
                </p>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Search by street address or BBL format (e.g., &quot;1-13-1&quot;)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Automatically matches alternative addresses (AKAs) for corner buildings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Instant preview of ownership and recent transaction data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Lightning-fast results as you type</span>
                  </li>
                </ul>
              </div>
              <ScreenshotDialog
                src="/screenshots/autocomplete.png"
                alt="Smart autocomplete search showing instant property suggestions with BBL and address matching, including AKA addresses and transaction previews"
                title="Autocomplete Search"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources Section */}
      <div className="border-t border-foreground/10 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-foreground">Powered by Official NYC Data</h2>
          <p className="mt-4 text-foreground/70">
            All data sourced from official NYC government databases including ACRIS, PLUTO, DOB, and HPD records.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-foreground/60">
            <div>ACRIS</div>
            <div className="h-4 w-px bg-foreground/20"></div>
            <div>PLUTO</div>
            <div className="h-4 w-px bg-foreground/20"></div>
            <div>DOB</div>
            <div className="h-4 w-px bg-foreground/20"></div>
            <div>HPD</div>
            <div className="h-4 w-px bg-foreground/20"></div>
            <div>Tax Assessments</div>
          </div>
        </div>
      </div>

      {/* Footer - Homepage only */}
      <Footer />
      </div>
    </div>
  );
}
