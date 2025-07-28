import express from "express";
import { createUserAuth,loginUserAuth ,getDashboard, getAllUsers} from "../controllers/authcontroller.js";
import protect from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/register-user',createUserAuth);
router.post('/login-user',loginUserAuth);
router.get('/dashboard',protect,getDashboard)
router.get('/get-users',getAllUsers)



export default router;