import fs from 'fs';
import Jimp from 'jimp';
import jsQR from 'jsqr';

async function readQR() {
  const buffer = fs.readFileSync('qrcode.png');

  try {
    const image = await Jimp.read(buffer);
    const decodedQR = jsQR(
      new Uint8ClampedArray(image.bitmap.data),
      image.bitmap.width,
      image.bitmap.height
    );
    if (!decodedQR) {
      throw new Error('QR code not found in the image');
    }
    return decodedQR.data;
  } catch (error) {
    console.error('Error while reading QR code', error);
    throw new Error('Error while reading QR code');
  }
}

export default readQR;
