import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Define employee upload folder
const dir = 'uploads/employee';
fs.mkdirSync(dir, { recursive: true }); // ensure folder exists

// Set up disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'employee-' + Date.now() + ext);
  }
});

// Create multer instance
const uploadEmployee = multer({ storage });

export default uploadEmployee;
