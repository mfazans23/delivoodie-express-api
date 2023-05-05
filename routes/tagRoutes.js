import express from 'express'

import {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  deleteTags,
} from '../controllers/tagController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect, admin)

router.route('/').get(getTags).post(createTag).delete(deleteTags)
router.route('/:id').get(getTagById).put(updateTag).delete(deleteTag)

export default router
