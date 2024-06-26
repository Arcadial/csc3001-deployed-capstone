import dayjs from 'dayjs';
import { Certificate, CertificateMap } from '../types/certificate';

export default function processCertificateForOrgB(
  extractedCertificate: string[],
  mapping: CertificateMap
): Certificate | null {
  const rawDate = extractedCertificate[mapping.issuingDate];
  const cleanedDate = rawDate
    .replace('Presented on the ', '')
    .replace('th of', '')
    .replace('st of', '')
    .replace('nd of', '')
    .replace('rd of', '')
    .replace(/(\d{1,2})(?:rd|th|nd|st)/, '$1');
  const formattedDate = dayjs(cleanedDate, 'D MMMM YYYY').format(
    'YYYY-MM-DDTHH:mm:ss'
  );

  return {
    institute: extractedCertificate[mapping.institute],
    recipient: extractedCertificate[mapping.recipient],
    major: extractedCertificate[mapping.major]
      .split(' in ')[1]
      .split(' from ')[0],
    degreeLevel: extractedCertificate[mapping.degreeLevel].split(' in ')[0],
    issuingDate: formattedDate,
    issuingHead: extractedCertificate[mapping.issuingHead]
      .split(': ')[1]
      .split(',')[0],
  };
}
