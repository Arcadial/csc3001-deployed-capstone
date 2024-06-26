import express, { Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import * as config from './config';
import { logger } from './logger';

const { UNAUTHORIZED, OK } = StatusCodes;
const router = express.Router();

const generateApiKey = (username: string): string => {
  if (username === 'org1User') {
    return config.org1ApiKey;
  } else if (username === 'org2User') {
    return config.org2ApiKey;
  }
  return '';
};

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  logger.debug({ username }, 'Attempting to authenticate user');

  const creds = config.ORG_CREDS;
  const pass = creds.get(username);

  // Simple username and password check
  if (pass && pass === password) {
    const apiKey = generateApiKey(username);
    logger.debug({ username }, 'User authenticated successfully');
    return res.status(OK).json({ apiKey });
  }

  logger.debug({ username }, 'Authentication failed');
  return res.status(UNAUTHORIZED).json({
    status: getReasonPhrase(UNAUTHORIZED),
    reason: 'INVALID_CREDENTIALS',
    timestamp: new Date().toISOString(),
  });
});

export { router as authRouter };
