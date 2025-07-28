import express from "express";
import { getCart, getCartCount, insertCart } from "../controllers/cartController.js";


const router = express.Router();

router.post('/insert-cart',insertCart);
router.get('/get-cart/:user_id',getCart);
router.get('/cart-count/:user_id',getCartCount);








export default router;