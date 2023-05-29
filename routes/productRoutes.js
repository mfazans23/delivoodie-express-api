import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
  getProductReview,
  createReview,
  removeReview,
  updateReview,
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

router
  .route('/:id/review')
  .get(getProductReview)
  .post(protect, createReview)
  .put(protect, updateReview)
  .delete(protect, removeReview)

export default router
