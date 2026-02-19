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
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Real-Time Transactions</h3>
              <p className="mt-2 text-foreground/70">
                Access the latest mortgages, deeds, and property transactions as they&apos;re recorded.
                Search through millions of ACRIS records with powerful filtering and sorting capabilities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-teal-500/20 bg-gradient-to-br from-teal-500/5 to-background p-6 hover:border-teal-500/40 transition-all hover:shadow-lg hover:shadow-teal-500/10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-md">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">Unmasked LLC Owners</h3>
              <p className="mt-2 text-foreground/70">
                See the real people and entities behind LLC-owned properties.
                We reveal the actual owners and decision-makers, cutting through corporate structures.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-background p-6 hover:border-amber-500/40 transition-all hover:shadow-lg hover:shadow-amber-500/10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-md">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">Comprehensive Tax Data</h3>
              <p className="mt-2 text-foreground/70">
                Access detailed property tax assessments, valuations, and exemptions.
                Track assessment history and understand the tax burden for any NYC property.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-background p-6 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a 2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Aggregated Building Contacts</h3>
              <p className="mt-2 text-foreground/70">
                Find all relevant contacts for any building - from HPD registrations, property managers,
                to responsible parties. All contact information aggregated from multiple official sources.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Search Highlight Section */}
      <div className="border-t border-foreground/10 bg-gradient-to-b from-foreground/[0.02] via-indigo-500/5 to-foreground/[0.05] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur-sm">
              <TableIcon className="h-4 w-4 text-indigo-600" />
              Bulk Data Search
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 bg-clip-text text-transparent md:text-4xl">
              Powerful Data Analysis at Your Fingertips
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
              Sort, filter, and analyze thousands of NYC property records simultaneously with our advanced bulk search tools.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Sort Feature */}
            <div className="flex gap-4 rounded-lg border border-foreground/10 bg-background p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/10">
                <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Sort by Latest Mortgages</h3>
                <p className="mt-1 text-sm text-foreground/70">
                  Track the most recent mortgage activity by date, amount, or lender. Stay updated on market trends.
                </p>
              </div>
            </div>

            {/* Building Class Filter */}
            <div className="flex gap-4 rounded-lg border border-foreground/10 bg-background p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/10">
                <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Filter by Building Class</h3>
                <p className="mt-1 text-sm text-foreground/70">
                  Target specific property types: residential, commercial, condos, co-ops, and more.
                </p>
              </div>
            </div>

            {/* Owner Filter */}
            <div className="flex gap-4 rounded-lg border border-foreground/10 bg-background p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/10">
                <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Search Recorded Owners</h3>
                <p className="mt-1 text-sm text-foreground/70">
                  Find all properties owned by specific individuals, companies, or entities across NYC.
                </p>
              </div>
            </div>

            {/* Amount Filter */}
            <div className="flex gap-4 rounded-lg border border-foreground/10 bg-background p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/10">
                <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Filter by Amount Range</h3>
                <p className="mt-1 text-sm text-foreground/70">
                  Set minimum and maximum thresholds for mortgage amounts and transaction values.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/bulk-search"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <TableIcon className="h-5 w-5" />
              Try Bulk Search
            </Link>
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
