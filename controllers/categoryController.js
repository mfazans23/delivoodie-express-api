import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({})
  res.json(categories)
})

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (category) {
    res.json(category)
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

const createCategory = asyncHandler(async (req, res) => {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
  })

  const createdCategory = await category.save()
  res.status(201).json(createdCategory)
})

const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body

  const category = await Category.findById(req.params.id)

  if (category) {
    category.name = name
    category.description = description

    const updatedCategory = await category.save()
    res.json(updatedCategory)
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (category) {
    await category.remove()
    res.json({ message: 'Category deleted' })
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

const deleteCategories = asyncHandler(async (req, res) => {
  const result = await Category.deleteMany({})
  if (result.deletedCount > 0) {
    res.json({ message: 'Categories deleted' })
  } else {
    res.status(404)
    throw new Error('Categories not found')
  }
})

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategories,
}
