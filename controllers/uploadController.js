import { v2 as cloudinary } from 'cloudinary'

const uploadImage = (req, res) => {
  const file = req.file

  console.log(req.file)

  cloudinary.uploader.upload(file.path, function (error, result) {
    if (error) {
      throw new Error(error)
    }
    res.json({ image_url: result.url })
  })
}

export { uploadImage }
