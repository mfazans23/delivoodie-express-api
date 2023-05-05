import express from 'express'
import multer from 'multer'
import { uploadImage } from '../controllers/uploadController.js'

const router = express.Router()

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({ storage: storage })

router.post('/', upload.single('image'), uploadImage)

export default router
