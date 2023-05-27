import asyncHandler from 'express-async-handler'
import { v2 as cloudinary } from 'cloudinary'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import Category from '../models/categoryModel.js'
import Tag from '../models/tagModel.js'

// @desc   Fetch all products
// @route  GET /api/Products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    .populate('category')
    .populate('tags')
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc   Fetch a product
// @route  GET /api/Products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate([
    { path: 'category', select: '-_id name' },
    { path: 'tags', select: '-_id name' },
  ])
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc   Create a product
// @route  POST /api/product
// @access Private
const createProduct = asyncHandler(async (req, res) => {
  const product = req.body
  const file = req.file

  let categoryMap = await getCategoryMap()
  let categoryId = categoryMap.get(product.category)
  if (!categoryId) {
    const newCategory = await Category.create({ name: product.category })
    categoryId = newCategory._id
  }

  let tagIds = []

  for (const tag of product.tags.split(',')) {
    let tagMap = await getTagMap()
    let tagId = tagMap.get(tag)

    if (!tagId) {
      const newTag = await Tag.create({ name: tag })
      tagId = newTag._id
    }
    tagIds.push(tagId)
  }

  // image file url from cloudinary\
  const result = await cloudinary.uploader.upload(file.path, {
    transformation: [{ width: 1000, height: 1000, crop: 'fill' }],
  })

  const newProduct = new Product({
    user: req.user._id,
    name: product.name,
    price: product.price,
    image: result.url,
    countInStock: product.countInStock,
    description: product.description,
    category: categoryId,
    tags: tagIds,
  })

  await newProduct.save()

  res.status(201).json(newProducts)
})

const getCategoryMap = async () => {
  const categories = await Category.find({})
  const categoryMap = new Map()
  categories.forEach((category) => categoryMap.set(category.name, category._id))
  return categoryMap
}

const getTagMap = async () => {
  const tags = await Tag.find({})
  const tagMap = new Map()
  tags.forEach((tag) => tagMap.set(tag.name, tag._id))
  return tagMap
}

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, tags, countInStock } = req.body
  const file = req.file

  const product = await Product.findById(req.params.id)

  if (product) {
    let categoryMap = await getCategoryMap()

    let categoryId
    if (category) {
      categoryId = categoryMap.get(category)
      if (!categoryId) {
        const newCategory = await Category.create({ name: product.category })
        categoryId = newCategory._id
      }
    }

    let tagIds = []

    if (tags) {
      let tagMap = await getTagMap()
      let tagId = tagMap.get(tags)

      if (!tagId) {
        const newTag = await Tag.create({ name: tags })
        tagId = newTag._id
      }
      tagIds.push(tagId)
    }

    let result
    if (file) {
      result = await cloudinary.uploader.upload(file.path, {
        transformation: [{ width: 1000, height: 1000, crop: 'fill' }],
      })
      if (result) {
        product.image = result.url
      }
    }

    product.name = name || product.name
    product.price = price || product.price
    product.description = description || product.description
    product.countInStock = countInStock || product.countInStock
    product.category = categoryId || product.category
    product.tags = tagIds || product.tags

    const updatedProduct = await product.save()

    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const getTopProducts = asyncHandler(async (req, res) => {
  const topProducts = await Product.find({}).sort({ rating: -1 }).limit(5)

  res.json(topProducts)
})

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id)

  if (product) {
    return res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const getProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product.reviews)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const createReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  const reviewer = await User.findById(req.user._id)

  if (product) {
    const hasReviewedProduct = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    )

    if (hasReviewedProduct) {
      res.status(403)
      throw new Error('User already reviewed the product')
    } else {
      const review = {
        user: req.user._id,
        name: reviewer.name,
        rating: req.body.rating,
        comment: req.body.comment,
      }
      product.reviews.push(review)

      product.numReviews = product.reviews.length
      product.rating = (
        product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.numReviews
      ).toFixed(2)

      await product.save()

      res.json(product.reviews[product.numReviews - 1])
    }
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const removeReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    const reviewByUser = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    )

    if (reviewByUser) {
      const reviewIndex = product.reviews.indexOf(reviewByUser)
      const removedReview = product.reviews.splice(reviewIndex, 1)

      product.numReviews = product.reviews.length

      product.rating =
        product.numReviews !== 0
          ? (
              (product.rating * (product.numReviews + 1) -
                reviewByUser.rating) /
              product.numReviews
            ).toFixed(2)
          : 0

      await product.save()
      res.json(removedReview)
    } else {
      res.status(404)
      throw new Error('Review not found')
    }
  }
})

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  getTopProducts,
  deleteProduct,
  getProductReview,
  createReview,
  removeReview,
}
