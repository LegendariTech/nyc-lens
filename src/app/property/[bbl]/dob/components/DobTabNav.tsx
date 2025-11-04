'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { ViolationsDisplay } from './ViolationsDisplay';
import { CertificateOfOccupancyDisplay } from './CertificateOfOccupancyDisplay';
import { ComplaintsDisplay } from './ComplaintsDisplay';
import { PermitIssuanceDisplay } from './PermitIssuanceDisplay';

interface DobTabNavProps {
  bbl: string;
  activeSubTab?: string;
}

export function DobTabNav({ bbl, activeSubTab }: DobTabNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Default to violations if no sub-tab is specified
  const currentTab = activeSubTab || 'violations';

  const handleTabChange = (value: string) => {
    // Build path-based URL with subtab
    const newPath = `/property/${bbl}/dob/${value}`;
    
    // Preserve search params (like address)
    const params = searchParams.toString();
    const fullPath = params ? `${newPath}?${params}` : newPath;
    
    // Update URL
    router.push(fullPath, { scroll: false });
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      <TabsList>
        <TabsTrigger value="violations">Violations</TabsTrigger>
        <TabsTrigger value="certificate-of-occupancy">Certificate of Occupancy</TabsTrigger>
        <TabsTrigger value="complaints">Complaints</TabsTrigger>
        <TabsTrigger value="permit-issuance">Permit Issuance</TabsTrigger>
      </TabsList>

      <TabsContent value="violations">
        <ViolationsDisplay bbl={bbl} data={null} metadata={null} error={undefined} />
      </TabsContent>

      <TabsContent value="certificate-of-occupancy">
        <CertificateOfOccupancyDisplay bbl={bbl} data={null} metadata={null} error={undefined} />
      </TabsContent>

      <TabsContent value="complaints">
        <ComplaintsDisplay bbl={bbl} data={null} metadata={null} error={undefined} />
      </TabsContent>

      <TabsContent value="permit-issuance">
        <PermitIssuanceDisplay bbl={bbl} data={null} metadata={null} error={undefined} />
      </TabsContent>
    </Tabs>
  );
}

