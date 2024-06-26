import { mkdirSync } from 'fs';

// Function to ensure the directory exists
const ensureDirectoryExists = (...directoryPath: string[]) => {
  directoryPath.forEach((path) => {
    mkdirSync(path, { recursive: true });
  });
};

export { ensureDirectoryExists };
