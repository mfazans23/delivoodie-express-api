import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
} from '../controllers/productController.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router
  .route('/')
  .get(getProducts)
  .post(protect, admin, upload.single('image'), createProduct)

router.route('/top').get(getTopProducts)

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.single('image'), updateProduct)
  .delete(protect, admin, deleteProduct)

export default router
