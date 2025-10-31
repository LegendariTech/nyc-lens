import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyAutocomplete } from '@/components/search/PropertyAutocomplete';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { OverviewTab } from './components/OverviewTab';
import { PlutoTab } from './components/PlutoTab/PlutoTab';
import { DobTab } from './components/DobTab';
import { HpdTab } from './components/HpdTab';
import { fetchPlutoData } from '@/services/plutoData';

interface PropertyPageProps {
  params: Promise<{
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function PropertyPage({ params, searchParams }: PropertyPageProps) {
  const { bbl } = await params;
  const { address } = await searchParams;

  // Parse BBL format (e.g., "1-11-111" -> borough: 1, block: 11, lot: 111)
  const bblParts = bbl.split('-');

  if (bblParts.length !== 3) {
    notFound();
  }

  // const [borough, block, lot] = bblParts; // TODO: Use these for dynamic data fetching

  // Fetch PLUTO data
  const { data, metadata, error } = await fetchPlutoData(bbl);

  return (
    <div className="flex h-full w-full flex-col overflow-auto scroll-container">
      {/* Search Header */}
      <div className="sticky top-0 z-50 border-b border-foreground/20 bg-background py-3 px-6">
        <div className="mx-auto max-w-screen-xl">
          <PropertyAutocomplete compact initialValue={address || ''} autoFocus={false} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-screen-xl space-y-6">
          {/* Tabs for different data sources */}
          <Tabs defaultValue="pluto" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pluto">PLUTO</TabsTrigger>
              <TabsTrigger value="dob">DOB</TabsTrigger>
              <TabsTrigger value="hpd">HPD</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="relative">
                <OverviewTab data={data} metadata={metadata} error={error} bbl={bbl} />
              </div>
            </TabsContent>

            <TabsContent value="pluto">
              <div className="relative">
                <PlutoTab data={data} metadata={metadata} error={error} bbl={bbl} />
              </div>
            </TabsContent>

            <TabsContent value="dob">
              <DobTab bbl={bbl} />
            </TabsContent>

            <TabsContent value="hpd">
              <HpdTab bbl={bbl} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

