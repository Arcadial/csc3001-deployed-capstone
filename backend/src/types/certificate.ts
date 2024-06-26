export type Certificate = {
  institute: string;
  recipient: string;
  major: string;
  degreeLevel: string;
  issuingDate: string;
  issuingHead: string;
};

export type CertificateMap = {
  institute: number;
  recipient: number;
  major: number;
  degreeLevel: number;
  issuingDate: number;
  issuingHead: number;
};

export interface CertificateMapping {
  [org: string]: {
    institute: number;
    recipient: number;
    major: number;
    degreeLevel: number;
    issuingDate: number;
    issuingHead: number;
  };
}
