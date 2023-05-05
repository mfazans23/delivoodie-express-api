import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Cart from '../models/cartModel.js'

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, itemsPrice, shippingPrice, totalPrice } =
    req.body

  if (!orderItems || orderItems.length == 0) {
    res.status(404)
    throw new Error('No order items')
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    await Cart.findOneAndRemove({ user: req.user._id })

    res.status(201).json(createdOrder)
  }
})

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('shippingAddress')

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    'shippingAddress'
  )
  res.json(orders)
})

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', '_id name')
    .populate('shippingAddress')
  res.json(orders)
})

const removeOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndRemove(req.params.id)

  res.json({ message: 'Order removed', order })
})

export {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  removeOrder,
}
