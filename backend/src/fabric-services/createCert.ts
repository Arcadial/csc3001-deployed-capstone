import { Certificate } from '../types/certificate';
import { Queue } from 'bullmq';
import { addSubmitTransactionJob } from '../routers/jobs';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { logger } from '../routers/logger';

const { ACCEPTED, INTERNAL_SERVER_ERROR } = StatusCodes;

type Response = {
  status: string;
  jobId?: string;
  timestamp: string;
};

const createCert = async (
  queue: Queue,
  mspId: string,
  id: string,
  certificate: Certificate
): Promise<Response | undefined> => {
  try {
    const submitQueue = queue;
    const jobId = await addSubmitTransactionJob(
      submitQueue,
      mspId,
      'CreateCertificate',
      JSON.stringify({ id, ...certificate })
    );

    return {
      status: getReasonPhrase(ACCEPTED),
      jobId: jobId,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    logger.error(
      { err },
      'Error processing create asset request for asset ID %s',
      id
    );

    return {
      status: getReasonPhrase(INTERNAL_SERVER_ERROR),
      timestamp: new Date().toISOString(),
    };
  }
};

export default createCert;
