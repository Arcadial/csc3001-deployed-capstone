import { Certificate } from '../../types/certificate';
import { Contract } from 'fabric-network';
import { logger } from '../../routers/logger';
import { evaluateTransaction } from '../../routers/fabric';

const validateCert = async (
  contract: Contract,
  id: string,
  certificate: Certificate
): Promise<boolean | undefined> => {
  try {
    const data = await evaluateTransaction(
      contract,
      'ValidateCertificate',
      JSON.stringify({ id, ...certificate })
    );

    return JSON.parse(data.toString());
  } catch (error) {
    logger.error(`Error validating certificate: ${error}`);
  }
};

export default validateCert;
