import axios from 'axios';
import fs from 'fs';
import path from 'path';

const OCR_HOST = 'https://rnkns-219-74-115-4.a.free.pinggy.link';
const OCR_ENDPOINT = '/process-image';

// Mapping of file extensions to MIME types
const mimeTypes: { [key: string]: string } = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
};

async function execOCRScript(certPath: string) {
  try {
    // Read the file from the certPath
    const imageData = fs.readFileSync(certPath);

    // Extract the filename from the certPath
    const filename = path.basename(certPath);

    // Determine the MIME type based on the file extension
    const extname = path.extname(certPath).toLowerCase();
    const mimeType = mimeTypes[extname];

    if (!mimeType) {
      throw new Error(`Unsupported file extension: ${extname}`);
    }

    // Create a FormData object
    const formData = new FormData();

    // Create a Blob object from the file data
    const fileBlob = new Blob([imageData], { type: mimeType });

    // Append the Blob object with the filename to the FormData
    formData.append('image', fileBlob, filename);

    // Send the multipart form-data request to the OCR endpoint
    const response = await axios.post(`${OCR_HOST}${OCR_ENDPOINT}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the response data
    return response.data;
  } catch (error: any) {
    console.error('Error while executing OCR script', error);
    throw new Error('Error while executing OCR script ' + error.message);
  }
}

export default execOCRScript;
