import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
)

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cartItems: [cartItemSchema],
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
  },
  { timestamps: true }
)

cartSchema.methods.getItemsPrice = function () {
  let itemsPrice = 0
  this.cartItems.forEach((item) => {
    itemsPrice += item.qty * item.price
  })
  return itemsPrice
}

cartSchema.methods.getShippingPrice = function () {
  const itemsPrice = this.getItemsPrice()
  let shippingPrice = 0

  if (itemsPrice >= 100000) {
    shippingPrice = 0
  } else if (itemsPrice >= 50000) {
    shippingPrice = 10000
  } else if (itemsPrice > 0) {
    shippingPrice = 20000
  }

  return shippingPrice
}

cartSchema.methods.getTotalPrice = function () {
  const itemsPrice = this.getItemsPrice()
  const shippingPrice = this.getShippingPrice()
  const totalPrice = itemsPrice + shippingPrice
  return totalPrice
}

const Cart = mongoose.model('Cart', cartSchema)

export default Cart
