import dayjs from 'dayjs';
import { Certificate, CertificateMap } from '../types/certificate';

export default function processCertificateForOrgA(
  extractedCertificate: string[],
  mapping: CertificateMap
): Certificate | null {
  const rawDate = extractedCertificate[mapping.issuingDate];
  const cleanedDate = rawDate
    .replace(/this | day of | of /g, '')
    .replace(/(\d+)(st|nd|rd|th)/, '$1');
  const formattedDate = dayjs(cleanedDate, 'D MMMM YYYY').format(
    'YYYY-MM-DDTHH:mm:ss'
  );

  return {
    institute: extractedCertificate[mapping.institute],
    recipient: extractedCertificate[mapping.recipient],
    major: extractedCertificate[mapping.major].split(' in ')[1],
    degreeLevel: extractedCertificate[mapping.degreeLevel].split(' in ')[0],
    issuingDate: formattedDate,
    issuingHead: extractedCertificate[mapping.issuingHead],
  };
}
