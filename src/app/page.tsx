import Link from "next/link";

export default async function Home() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">About</h1>
      <p className="text-foreground/80 mt-2">About page placeholder.</p>
      <div className="mt-4">
        <Link
          href="/search"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Start Search
        </Link>
      </div>
    </div>
  );
}
