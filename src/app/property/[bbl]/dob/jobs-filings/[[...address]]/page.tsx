import { notFound } from 'next/navigation';
import { parseAddressFromUrl } from '@/utils/urlSlug';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { DobTabNav } from '../../components';
import { DobJobApplicationsDisplay } from './components/DobJobApplicationsDisplay';
import { fetchDobJobApplications, fetchDobJobApplicationsNow } from '@/data/dobJobs';

interface DobJobsFilingsPageProps {
  params: Promise<{
    address?: string[];
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function DobJobsFilingsPage({ params, searchParams }: DobJobsFilingsPageProps) {
  const { bbl, address: addressSegments } = await params;
  const { address: queryAddress } = await searchParams;

  const address = parseAddressFromUrl(addressSegments) || queryAddress;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // Fetch DOB job applications data (both BIS and NOW)
  const [jobApplicationsResult, jobApplicationsNowResult] = await Promise.all([
    fetchDobJobApplications(bbl),
    fetchDobJobApplicationsNow(bbl),
  ]);

  return (
    <PropertyPageLayout bbl={bbl} activeTab="dob" address={address} maxWidth="full">
      <DobTabNav bbl={bbl} activeSubTab="jobs-filings" />
      <DobJobApplicationsDisplay
        bbl={bbl}
        jobApplications={jobApplicationsResult}
        jobApplicationsNow={jobApplicationsNowResult}
      />
    </PropertyPageLayout>
  );
}
