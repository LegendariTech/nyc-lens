import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { DobTabNav } from '../components/DobTabNav';
import { DobJobApplicationsDisplay } from './components/DobJobApplicationsDisplay';
import { fetchDobJobApplications, fetchDobJobApplicationsNow } from '@/data/dobJobs';

interface DobJobsFilingsPageProps {
  params: Promise<{
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function DobJobsFilingsPage({ params, searchParams }: DobJobsFilingsPageProps) {
  const { bbl } = await params;
  const { address } = await searchParams;

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
