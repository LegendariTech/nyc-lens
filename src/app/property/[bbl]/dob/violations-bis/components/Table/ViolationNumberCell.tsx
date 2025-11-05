import type { ICellRendererParams } from 'ag-grid-community';
import type { DobViolationBISRow } from './types';

/**
 * Trim leading alphabetic characters from violation number
 * V* 051286E145551 => 051286E145551
 */
function trimViolationNumber(violationNumber: string | null | undefined): string {
  if (!violationNumber) return '';
  return violationNumber.replace(/^[A-Za-z*\s]+/, '');
}

/**
 * Generate BIS web link for violation
 */
function generateBISLink(isn: string | null | undefined, violationNumber: string | null | undefined, bin: string | null | undefined): string | null {
  if (!isn || !violationNumber) return null;

  const ppremise60 = trimViolationNumber(violationNumber);
  if (!ppremise60) return null;

  // Pad ISN to 10 digits with leading zeros
  const paddedISN = isn.padStart(10, '0');

  return `https://a810-bisweb.nyc.gov/bisweb/ActionViolationDisplayServlet?requestid=3&allbin=${bin || ''}&allinquirytype=BXS3OCV4&allboroughname=&allstrt=&allnumbhous=&allisn=${paddedISN}&ppremise60=${ppremise60}`;
}

/**
 * Cell renderer component for violation number link
 */
export function ViolationNumberCell(params: ICellRendererParams<DobViolationBISRow>) {
  const { data, value } = params;
  if (!data || !value) return <span>{value || 'N/A'}</span>;

  const link = generateBISLink(data.isn_dob_bis_viol, data.number, data.bin);

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-600 underline"
      >
        {value}
      </a>
    );
  }

  return <span>{value}</span>;
}

