import { Certificate } from '../../types/certificate';
import { Contract } from 'fabric-network';
import { logger } from '../../routers/logger';
import { evaluateTransaction } from '../../routers/fabric';

const getAllCertificates = async (
  contract: Contract
): Promise<Array<Certificate> | undefined> => {
  try {
    const data = await evaluateTransaction(contract, 'GetAllCertificates');

    let certificates: Array<Certificate> = [];
    if (data.length > 0) {
      certificates = JSON.parse(data.toString());
    }

    return certificates;
  } catch (err) {
    logger.error({ err }, 'Error processing get all certificates request');
  }
};

export default getAllCertificates;
