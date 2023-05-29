import mongoose from 'mongoose'
import asyncHandler from 'express-async-handler'
import Cart from '../models/cartModel.js'
import Address from '../models/addressModel.js'

const addItemToCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })

  if (cart) {
    const item = cart.cartItems.find(
      (item) => item.product.toString() === req.body.product
    )

    if (item) {
      item.qty = req.body.qty
    } else {
      cart.cartItems.unshift({
        product: mongoose.Types.ObjectId(req.body.product),
        name: req.body.name,
        price: req.body.price,
        countInStock: req.body.countInStock,
        image: req.body.image,
        qty: req.body.qty,
      })
    }

    await cart.save()
    res.json(
      cart.cartItems.find(
        (item) => item.product.toString() === req.body.product
      )
    )
  } else {
    const newCart = new Cart({
      user: req.user._id,
      cartItems: [
        {
          product: mongoose.Types.ObjectId(req.body.product),
          name: req.body.name,
          price: req.body.price,
          countInStock: req.body.countInStock,
          image: req.body.image,
          qty: req.body.qty,
        },
      ],
    })

    await newCart.save()

    res.json(newCart.cartItems[0])
  }
})

const removeItemFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })

  if (cart) {
    const removeIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === req.params.product
    )

    const removedItem = cart.cartItems.splice(removeIndex, 1)[0]

    await cart.save()

    res.json(removedItem)
  } else {
    res.status(404)
    throw new Error('Cart not found')
  }
})

const getMyCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'shippingAddress'
  )

  if (cart) {
    res.json({
      user: req.user._id,
      cartItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      itemsPrice: cart.getItemsPrice(),
      shippingPrice: cart.getShippingPrice(),
      totalPrice: cart.getTotalPrice(),
    })
  } else {
    const newCart = await Cart.create({ user: req.user._id })
    res.json({
      user: req.user._id,
      cartItems: newCart.cartItems,
      shippingAddress: newCart.shippingAddress,
      itemsPrice: newCart.getItemsPrice(),
      shippingPrice: newCart.getShippingPrice(),
      totalPrice: newCart.getTotalPrice(),
    })
  }
})

const setShippingAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.body
  const cart = await Cart.findOne({ user: req.user._id })

  if (cart) {
    cart.shippingAddress = addressId
    await cart.save()

    const address = await Address.findById(cart.shippingAddress)
    res.json(address)
  } else {
    res.status(404)
    throw new Error('Cart not found')
  }
})

const removeCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })

  await cart.remove()

  res.json({ message: 'Cart removed' })
})

export {
  addItemToCart,
  getMyCart,
  removeItemFromCart,
  setShippingAddress,
  removeCart,
}
