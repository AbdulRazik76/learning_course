import express from "express";
import { InsertUserCourse } from "../controllers/userCourseController.js";


const router = express.Router();

router.post('/insert-user-course',InsertUserCourse);

export default router;
