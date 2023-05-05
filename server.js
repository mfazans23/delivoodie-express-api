import express from 'express'
import cors from 'cors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import config from './config/config.js'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import tagRoutes from './routes/tagRoutes.js'
import addressRoutes from './routes/addressRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

connectDB()

const app = express()

app.use(cors())
app.use(express.json())

// routes
app.use('/api/product', productRoutes)
app.use('/api/user', userRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/tag', tagRoutes)
app.use('/api/address', addressRoutes)
app.use('/upload', uploadRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = config.PORT || 5000

app.listen(
  PORT,
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`)
)
