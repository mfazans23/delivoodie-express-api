import express from 'express'
import {
  addItemToCart,
  addItemsToCart,
  getMyCart,
  removeItemFromCart,
  removeCart,
  setShippingAddress,
} from '../controllers/cartController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .post(protect, addItemToCart)
  .get(protect, getMyCart)
  .delete(protect, removeCart)
router.post('/items', protect, addItemsToCart)
router.route('/item/:product').delete(protect, removeItemFromCart)
router.route('/shippingaddress').put(protect, setShippingAddress)

export default router
