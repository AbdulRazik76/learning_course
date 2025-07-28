import express from "express";
import { insertCategory, getCategory, deleteCategory, updateCategory } from "../controllers/categoryController.js";


const router = express.Router();

router.post('/create-category',insertCategory);
router.get('/get-category',getCategory);
router.delete('/delete-category/:id',deleteCategory);
router.put('/update-category/:id',updateCategory);




export default router;