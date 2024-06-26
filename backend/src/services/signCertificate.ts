import { ecurve } from '../service-constants.ts/elliptic';
import { createHash } from 'crypto';
import { Certificate } from '../types/certificate';
import { v4 as uuidv4 } from 'uuid';

export default function signCertificate(
  privateKey: string,
  certificate: Certificate
) {
  const sha256 = createHash('sha256');
  const id = uuidv4();

  // To uniquely identify the certificate in the event of similar certificates, eg. Exactly same name, major and date
  const uniqueCertificate = { ...certificate, id };
  console.log('Unique Certificate:', uniqueCertificate);
  const message = JSON.stringify(uniqueCertificate);

  sha256.update(message);
  const msgHash = sha256.digest();
  const key = ecurve.keyFromPrivate(privateKey, 'hex');
  const signature = key.sign(msgHash);
  const derSign = signature.toDER();

  return { signature: derSign.toString(), id };
}
