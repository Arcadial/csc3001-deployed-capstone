import express, { Request, Response } from 'express';
import 'dotenv/config';
import path from 'path';
import upload from '../service-constants.ts/diskStorage';
import processImagePaths from '../services/processImagePaths';
import execOCRScript from '../services/execOCRScript';
import { processCertificate } from '../services/processCert';
import signCertificate from '../services/signCertificate';
import generateQRCode from '../services/generateQR';
import stampQROnCertificate from '../services/stampQR';
import verifyCertificate from '../services/verifyCertificate';
import fs from 'fs';
import fsPromise from 'fs/promises';
import validateCert from '../fabric-services/certs/validateCert';
import { Contract } from 'fabric-network';
import createCert from '../fabric-services/createCert';
import { Queue } from 'bullmq';
import { logger } from './logger';
import getAllCertificates from '../fabric-services/certs/getAllCerts';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { authenticateApiKey } from './auth';
import * as config from './config';

const { INTERNAL_SERVER_ERROR, OK } = StatusCodes;

export const certRouter = express.Router();

certRouter.get('/', authenticateApiKey, async (req: Request, res: Response) => {
  logger.debug('Get all certificates request received');
  try {
    const mspId = req.user as string;
    const contract = req.app.locals[mspId]?.assetContract as Contract;

    const certificates = await getAllCertificates(contract);

    if (!certificates) {
      throw new Error('Error retrieving certificates');
    }

    return res.status(OK).json(certificates);
  } catch (err) {
    logger.error({ err }, 'Error processing get all certificates request');
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: getReasonPhrase(INTERNAL_SERVER_ERROR),
      timestamp: new Date().toISOString(),
    });
  }
});

certRouter.post(
  '/process-new-cert',
  authenticateApiKey,
  upload.single('image'),
  async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).send('No file uploaded');

    const certPath = req.file.path;
    const { qrPath, stampedCertPath } = processImagePaths(certPath);

    try {
      // To extract text from the image using OCR
      const extract = await execOCRScript(certPath);
      // To perform further processing on the extracted text and retrieve in Certificate format
      const certificate = processCertificate(extract.extractedText);

      if (!certificate) {
        throw new Error('Error processing certificate');
      }

      // To sign the Certificate
      const { signature, id } = signCertificate(
        process.env.PRIVATE_KEY_ORG1 ?? '',
        certificate
      );

      await createCert(
        req.app.locals.jobq as Queue,
        req.user as string,
        id,
        certificate
      );

      // To generate QR code based on the signature
      await generateQRCode(`${id};${signature}`, qrPath);
      // To stamp QR code on the certificate
      await stampQROnCertificate(certPath, qrPath, stampedCertPath);

      const stampedCertImage = await fsPromise.readFile(stampedCertPath);

      // To determine content type based on the uploaded file's extension
      const contentType = `image/${path.extname(stampedCertPath).slice(1)}`;

      // Set the Content-Disposition header with the filename
      const filename = path.basename(stampedCertPath);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`
      );

      return res.status(200).type(contentType).send(stampedCertImage);
    } catch (error: any) {
      return res.status(500).send('Error extracting text: ' + error.message);
    } finally {
      // To delete the uploaded certificate, QR code, and stamped certificate images
      await Promise.all([
        certPath && fs.existsSync(certPath) ? fsPromise.unlink(certPath) : null,
        qrPath && fs.existsSync(qrPath) ? fsPromise.unlink(qrPath) : null,
        stampedCertPath && fs.existsSync(stampedCertPath)
          ? fsPromise.unlink(stampedCertPath)
          : null,
      ]);
    }
  }
);

certRouter.post(
  '/verify-cert',
  upload.single('image'),
  async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).send('No file uploaded');

    const stampedCertPath = req.file.path;
    try {
      // To extract text from the image using OCR
      const extract = await execOCRScript(stampedCertPath);

      // To perform further processing on the extracted text and retrieve in Certificate format
      const certificate = processCertificate(extract.extractedText);

      if (!certificate) {
        throw new Error('Error processing certificate');
      }

      const qrText = extract.qrText;
      const [id, signature] = qrText[0].split(';');

      console.log('Certificate:', certificate);
      console.log('ID:', id);
      console.log('Signature:', signature);

      const mspId = config.mspIdOrg1 as string;
      const contract = req.app.locals[mspId]?.assetContract as Contract;
      const response = await validateCert(contract, id, certificate);

      if (!response) {
        throw new Error('The certificate is not valid');
      }

      res.send(
        verifyCertificate(
          JSON.stringify({ ...certificate, id }),
          process.env.PUBLIC_KEY_ORG1 ?? '',
          signature
        )
      );
    } catch (error: any) {
      res.status(400).send(error.message);
    } finally {
      if (stampedCertPath && fs.existsSync(stampedCertPath)) {
        await fsPromise
          .unlink(stampedCertPath)
          .catch((err) =>
            console.error('Error deleting stamped certificate:', err)
          );
      }
    }
  }
);
