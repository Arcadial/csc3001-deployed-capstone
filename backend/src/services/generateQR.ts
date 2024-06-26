import qrcode from 'qrcode';

async function generateQRCode(text: string, qrPath: string) {
  try {
    await qrcode.toFile(qrPath, text, {
      errorCorrectionLevel: 'H',
    });
  } catch (error) {
    console.error('Error while generating QR code', error);
    throw new Error('Error while generating QR code');
  }
}

export default generateQRCode;
