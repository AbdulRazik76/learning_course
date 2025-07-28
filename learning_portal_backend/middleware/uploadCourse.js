import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Ensure uploads/course directory exists
const courseDir = 'uploads/course';
fs.mkdirSync(courseDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, courseDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'course-' + Date.now() + ext);
  }
});

const uploadCourse = multer({ storage });

export default uploadCourse;
