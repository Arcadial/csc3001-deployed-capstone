import { Certificate, CertificateMap } from '../types/certificate';
import INSTITUTIONS from '../cert-processor/constants/organization';
import processCertificateForOrgA from '../cert-processor/processOrgA';
import processCertificateForOrgB from '../cert-processor/processOrgB';
import CERTIFICATE_MAPPING from '../cert-processor/constants/certificateMapping';

function determineOrganization(
  extractedCertificate: string[]
): string | null | undefined {
  for (const [institution, organization] of INSTITUTIONS) {
    if (extractedCertificate.includes(institution)) {
      return organization;
    }
  }
  return null;
}

export function processCertificate(
  extractedCertificate: string[]
): Certificate | null | undefined {
  const organization = determineOrganization(extractedCertificate);

  if (!organization) {
    console.error('Unable to determine the organization from the certificate.');
    return;
  }

  const mapping = CERTIFICATE_MAPPING[organization];
  if (!mapping) {
    console.error(`No mapping found for ${organization}.`);
  }

  const processingFunction = processingStrategies[organization];
  if (!processingFunction) {
    console.error(`No processing strategy defined for ${organization}.`);
    return;
  }

  return processingFunction(extractedCertificate, mapping);
}

const processingStrategies: {
  [key: string]: (
    extractedCertificate: string[],
    mapping: CertificateMap
  ) => Certificate | null;
} = {
  'Org A': processCertificateForOrgA,
  'Org B': processCertificateForOrgB,
};
