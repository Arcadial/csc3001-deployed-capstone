import { createHash } from 'crypto';
import { ecurve } from '../service-constants.ts/elliptic';

export default function verifyCertificate(
  message: string,
  publicKey: string,
  signature: string
) {
  console.log(message, publicKey, signature);
  const sha256 = createHash('sha256');
  sha256.update(message);
  const msgHash = sha256.digest();

  const signatureArr = signature.split(',');
  const signatureDER = signatureArr.map((s) => parseInt(s));

  const key = ecurve.keyFromPublic(publicKey, 'hex');
  try {
    return key.verify(msgHash, signatureDER);
  } catch (error: any) {
    throw new Error('Signature verification failed: ' + error.message);
  }
}
