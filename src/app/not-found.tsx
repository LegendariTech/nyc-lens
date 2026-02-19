import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex min-h-full flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <h1 className="text-9xl font-bold text-foreground/20">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-foreground">Page Not Found</h2>
          <p className="mt-4 text-lg text-foreground/70">
            The page you're looking for doesn't exist or may have been moved.
          </p>

          <div className="mt-8 space-y-4">
            <p className="text-sm text-foreground/70">Here are some helpful links:</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-foreground px-6 py-3 text-base font-medium text-background transition-opacity hover:opacity-90"
              >
                Go to Homepage
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-md border border-foreground/20 bg-background px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-foreground/5"
              >
                Search Properties
              </Link>
              <Link
                href="/bulk-search"
                className="inline-flex items-center justify-center rounded-md border border-foreground/20 bg-background px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-foreground/5"
              >
                Bulk Search
              </Link>
            </div>
          </div>

          <p className="mt-12 text-sm text-foreground/50">
            If you believe this is an error, please{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
