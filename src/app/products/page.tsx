import Link from "next/link";
import type { Metadata } from "next";
import { ScreenshotDialog } from "@/components/products/ScreenshotDialog";

export const metadata: Metadata = {
  title: "Products - BBL Club",
  description: "Explore BBL Club's comprehensive NYC real estate data tools: property overview snapshots, unmasked owner intelligence, and real-time ACRIS transaction tracking.",
};

export default function ProductsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Powerful Tools for NYC Real Estate Research
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Access comprehensive property data from multiple official sources, all in one place
          </p>
        </div>

        {/* Product Sections */}
        <div className="space-y-24">
          {/* Product 1: Property Overview */}
          <section id="overview" className="scroll-mt-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Comprehensive Property Snapshots
                </h2>
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
                <div className="mt-8">
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                  >
                    Try Property Search
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              <ScreenshotDialog
                src="/screenshots/overview.png"
                alt="Property overview panel showing building details, ownership, tax assessment, and contacts for 7 Leroy Street including interactive map and comprehensive data cards"
                title="Property Overview"
              />
            </div>
          </section>

          {/* Product 2: Owner Intelligence */}
          <section id="contacts" className="scroll-mt-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <ScreenshotDialog
                  src="/screenshots/contacts.png"
                  alt="Contacts page revealing unmasked owners extracted from mortgage documents with phone numbers and addresses, aggregated from HPD, tax records, and ACRIS databases"
                  title="Owner Intelligence"
                />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Unmasked Owner Intelligence
                </h2>
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
                <div className="mt-8">
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
                  >
                    Find Property Owners
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Product 3: Transaction Tracking */}
          <section id="transactions" className="scroll-mt-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Real-Time ACRIS Transaction Data
                </h2>
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
                <div className="mt-8">
                  <Link
                    href="/bulk-search"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
                  >
                    Explore Transactions
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              <ScreenshotDialog
                src="/screenshots/transactions.png"
                alt="Interactive transaction timeline with filtering showing deeds, mortgages, and assignments for 7 Leroy Street with complete party details and document links"
                title="Transaction Tracking"
              />
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center border-t border-foreground/10 pt-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Explore NYC Real Estate?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Start searching properties, uncover ownership structures, and track transactions today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Start Searching
            </Link>
            <Link
              href="/bulk-search"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-foreground/20 text-foreground font-semibold hover:bg-foreground/5 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Bulk Analysis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
