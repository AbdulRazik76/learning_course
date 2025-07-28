import express from 'express';
import {
  createCourse,
  getCourse,
  getCourseUser,
  updateCourseStatus,
  deleteCourse,
  getCourseById
} from '../controllers/courseController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/create-course', upload, createCourse);
router.get('/get-course', getCourse);
router.post('/get-course-user', getCourseUser);
router.put('/update-status/:id', updateCourseStatus);
router.delete('/delete-course/:id', deleteCourse);
router.post('/get-course', getCourseById);



export default router;
