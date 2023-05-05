import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isMain: {
      type: Boolean,
      required: true,
      default: false,
    },
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    village: {
      type: String,
      required: true,
    },
    otherDetails: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const Address = mongoose.model('Address', addressSchema)

export default Address
