import express from "express";
import { deleteEmployee, getEmployee, InsertEmployee } from "../controllers/employeeController.js";
import upload from "../middleware/uploadEmployee.js";  // ✅ fixed path

const router = express.Router();

router.post('/insert-employee', upload.single('profilePhoto'), InsertEmployee);
router.get('/get-employee', getEmployee);
router.delete('/delete-employee/:id', deleteEmployee);

export default router;
