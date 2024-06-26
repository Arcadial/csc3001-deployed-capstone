import { Certificate, CertificateRequest } from './certificate';

const compareCertificates = (
  certificate1: Certificate,
  certificate2: CertificateRequest
): boolean => {
  return (
    certificate1.Institute === certificate2.institute &&
    certificate1.Recipient === certificate2.recipient &&
    certificate1.Major === certificate2.major &&
    certificate1.DegreeLevel === certificate2.degreeLevel &&
    certificate1.IssuingDate === certificate2.issuingDate &&
    certificate1.IssuingHead === certificate2.issuingHead
  );
};

export default compareCertificates;
