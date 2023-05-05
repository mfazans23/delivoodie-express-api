import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategories,
} from '../controllers/categoryController.js'

const router = express.Router()

router.use(protect, admin)

router
  .route('/')
  .get(getCategories)
  .post(createCategory)
  .delete(deleteCategories)
router
  .route('/:id')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory)

export default router
