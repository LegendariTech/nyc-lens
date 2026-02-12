import Link from "next/link";
import { SearchIcon, TableIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex min-h-full flex-col">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Open Block
          </h1>
          <p className="mt-4 text-2xl font-medium text-foreground/80 md:text-3xl">
            NYC Real Estate Data, Transparent & Real-Time
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80 md:text-xl">
            Search the latest NYC property transactions, mortgages, and deeds in real-time.
            Uncover the true owners behind LLCs and access comprehensive tax and building information.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-base font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <SearchIcon className="h-5 w-5" />
              Start Searching
            </Link>
            <Link
              href="/bulk-search"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-foreground/20 bg-background px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <TableIcon className="h-5 w-5" />
              Bulk Search
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-foreground/10 bg-foreground/[0.02] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-foreground">
            Everything You Need to Know About NYC Properties
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {/* Feature 1 */}
            <div className="rounded-lg border border-foreground/10 bg-background p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/10">
                <svg className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Real-Time Transactions</h3>
              <p className="mt-2 text-foreground/70">
                Access the latest mortgages, deeds, and property transactions as they&apos;re recorded.
                Search through millions of ACRIS records with powerful filtering and sorting capabilities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-foreground/10 bg-background p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/10">
                <svg className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Unmasked LLC Owners</h3>
              <p className="mt-2 text-foreground/70">
                See the real people and entities behind LLC-owned properties.
                We reveal the actual owners and decision-makers, cutting through corporate structures.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-foreground/10 bg-background p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/10">
                <svg className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Comprehensive Tax Data</h3>
              <p className="mt-2 text-foreground/70">
                Access detailed property tax assessments, valuations, and exemptions.
                Track assessment history and understand the tax burden for any NYC property.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg border border-foreground/10 bg-background p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/10">
                <svg className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Aggregated Building Contacts</h3>
              <p className="mt-2 text-foreground/70">
                Find all relevant contacts for any building - from HPD registrations, property managers,
                to responsible parties. All contact information aggregated from multiple official sources.
              </p>
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
      </div>
    </div>
  );
}
