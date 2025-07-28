import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userCourseRoutes from './routes/userCourseRoutes.js';

dotenv.config();
connectDB();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const uploadDirs = ['images', 'videos'];
uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, 'uploads', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user-course', userCourseRoutes);

// Multer error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
