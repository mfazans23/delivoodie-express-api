import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import config from '../config/config.js'

// Configure cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
})

// Configure multer storage
const storage = multer.diskStorage({})

// Create multer instance with storage configuration
const upload = multer({ storage })

// Export the upload middleware
export default upload
