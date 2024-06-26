import { join, parse } from 'path';
import { ensureDirectoryExists } from './utils';

function processImagePaths(filePath: string) {
  const imagePath = filePath;
  // Root directory for storing images
  const generatedDir = join(parse(filePath).root, 'generated');
  const qrDir = join(generatedDir, 'qr');
  const stampDir = join(generatedDir, 'stamp');

  ensureDirectoryExists(qrDir, stampDir);

  // Extract filename and extension from the uploaded image path
  const { name, ext } = parse(imagePath);

  // Construct filenames for the QR code and stamped certificate images
  const qrFileName = `${name}_qr${ext}`;
  const stampedCertFileName = `${name}_stamped${ext}`;

  const qrPath = join(qrDir, qrFileName);
  const stampedCertPath = join(stampDir, stampedCertFileName);
  return { qrPath, stampedCertPath };
}

export default processImagePaths;
