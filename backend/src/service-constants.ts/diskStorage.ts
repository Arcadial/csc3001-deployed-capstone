import multer from 'multer';
import { join } from 'path';
import { ensureDirectoryExists } from '../services/utils';

const DIR = 'uploads';

function storage() {
  const uploadsDir = join(__dirname, '..', '..', DIR);
  ensureDirectoryExists(uploadsDir);

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${DIR}/`);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '_' + file.originalname);
    },
  });
}

const upload = multer({ storage: storage() });

export default upload;
