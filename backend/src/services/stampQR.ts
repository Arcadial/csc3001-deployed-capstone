import sharp from 'sharp';

const SIZE = 200;

async function stampQROnCertificate(
  certPath: string,
  qrCodePath: string,
  stampedCertPath: string
) {
  try {
    // Load the QR code image
    const qrCodeBuffer = await sharp(qrCodePath).resize(SIZE, SIZE).toBuffer();

    const { width, height } = await sharp(certPath).metadata();

    if (!width || !height) {
      console.error(
        'Error: Could not retrieve metadata for the background image.'
      );
      return;
    }

    const compositeImage = sharp(certPath).clone();

    const info = await compositeImage
      .composite([
        { input: qrCodeBuffer, top: height - SIZE, left: width - SIZE },
      ]) // Composite the resized QR code image at the bottom right corner
      // Output the final image
      .toFile(stampedCertPath);

    console.log('QR code stamped on the certificate:', info);
  } catch (error: any) {
    console.error('Error while stamping QR code on the certificate', error);
    throw new Error('Error while stamping QR code on the certificate');
  }
}

export default stampQROnCertificate;
