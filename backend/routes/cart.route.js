import express from 'express';
import { addToCart,
            updateCartItem,
            getCartProducts,
            removeFromCart

} from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middle.js';
import { get } from 'mongoose';

const router = express.Router();

router.get('/', protectRoute, getCartProducts); // Placeholder for getCartProducts
router.post('/',protectRoute, addToCart);
router.delete('/', protectRoute, removeFromCart); // Placeholder for removeFromCart
router.put('/', protectRoute, updateCartItem); // Placeholder for updateCartItem

export default router;
