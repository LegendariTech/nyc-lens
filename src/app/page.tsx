import Table from "@/components/table/property/PropertyTable";

export default async function Home() {

  return (
    <div className="font-sans h-dvh overflow-hidden p-4 pt-2">
      <main className="w-full h-full">
        <Table />
      </main>
    </div>
  );
}
