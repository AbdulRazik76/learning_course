import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = '';

    if (file.fieldname === 'images') {
      uploadPath = path.join(__dirname, '../uploads/images');
    } else if (file.fieldname === 'videos') {
      uploadPath = path.join(__dirname, '../uploads/videos');
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'images' && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else if (file.fieldname === 'videos' && file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
}).fields([
  { name: 'images', maxCount: 3 },
  { name: 'videos', maxCount: 5 }
]);

export default upload;
