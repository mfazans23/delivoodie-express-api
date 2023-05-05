import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import config from '../config/config.js'

const protect = asyncHandler(async (req, res, next) => {
  const bearerToken = req.headers.authorization

  if (bearerToken && bearerToken.startsWith('Bearer')) {
    const decoded = jwt.verify(bearerToken.split(' ')[1], config.JWT_SECRET)

    req.user = await User.findById(decoded._id).select('-password')

    next()
  } else {
    res.status(401)
    throw new Error('Not authorized, token failed')
  }
})

const admin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)

  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
})

export { protect, admin }
