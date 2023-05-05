import asyncHandler from 'express-async-handler'
import Address from '../models/addressModel.js'
import axios from 'axios'

const getAllAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({}).sort({
    updatedAt: -1,
  })

  if (!addresses) {
    res.status(404)
    throw new Error('Address not found')
  }

  res.json(addresses)
})

const createAddress = asyncHandler(async (req, res) => {
  const { name, phoneNumber, province, city, district, village, otherDetails } =
    req.body

  const newAddress = new Address({
    user: req.user._id,
    isMain: (await Address.countDocuments({ user: req.user._id })) === 0,
    name,
    phoneNumber,
    province,
    city,
    district,
    village,
    otherDetails,
  })

  await newAddress.save()

  res.status(201).json(newAddress)
})

const getAddressById = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id)

  if (address) {
    res.json(address)
  } else {
    res.status(404)
    throw new Error('Address not found')
  }
})

const getMyAddress = asyncHandler(async (req, res) => {
  const mainAddress = await Address.findOne({
    user: req.user._id,
    isMain: true,
  })

  let addresses = []

  if (mainAddress) {
    addresses = await Address.find({
      user: req.user._id,
      _id: { $ne: mainAddress._id },
    }).sort({ updatedAt: -1 })
    addresses.unshift(mainAddress)
  } else {
    addresses = await Address.find({ user: req.user._id }).sort({
      updatedAt: -1,
    })
  }

  res.json(addresses)
})

const updateAddress = asyncHandler(async (req, res) => {
  const {
    name,
    phoneNumber,
    isMain,
    province,
    city,
    district,
    village,
    otherDetails,
  } = req.body

  const address = await Address.findById(req.params.id)

  if (!address) {
    res.status(404)
    throw new Error('Address not found')
  }

  if (isMain) {
    await Address.findOneAndUpdate(
      { user: req.user._id, isMain: true },
      { $set: { isMain: false } }
    )
  }

  address.name = name || address.name
  address.phoneNumber = phoneNumber || address.phoneNumber
  address.isMain = isMain !== undefined ? isMain : address.isMain
  address.province = province || address.province
  address.city = city || address.city
  address.district = district || address.district
  address.village = village || address.village
  address.otherDetails = otherDetails || address.otherDetails

  const updatedAddress = await address.save()

  res.json(updatedAddress)
})

const setAddressAsMain = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id })

  const prevMainAddress = addresses.find((address) => address.isMain === true)

  if (prevMainAddress) {
    prevMainAddress.isMain = false
    await prevMainAddress.save()
  }

  const newMainAddress = addresses.find(
    (address) => address._id.toString() === req.params.id
  )
  if (newMainAddress) {
    newMainAddress.isMain = true
    await newMainAddress.save()
  }

  const updatedAddresses = await Address.find({ user: req.user._id }).sort({
    updatedAt: -1,
  })
  res.json(updatedAddresses)
})

const getMainAddress = asyncHandler(async (req, res) => {
  const mainAddress = await Address.findOne({
    user: req.user._id,
    isMain: true,
  })

  if (mainAddress) {
    res.json(mainAddress)
  } else {
    res.json({})
  }
})

const removeAddress = asyncHandler(async (req, res) => {
  const removedAddress = await Address.findOneAndRemove({ _id: req.params.id })

  if (removedAddress) {
    res.json(removedAddress)
  } else {
    res.status(404)
    throw new Error('Address not found')
  }
})

const getProvince = asyncHandler(async (req, res) => {
  const { data } = await axios.get(
    'https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json'
  )

  res.json(data)
})

const getCityByProvince = asyncHandler(async (req, res) => {
  const { data } = await axios.get(
    `https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${req.params.provinceId}.json`
  )

  res.json(data)
})

const getDistrictByCity = asyncHandler(async (req, res) => {
  const { data } = await axios.get(
    `https://emsifa.github.io/api-wilayah-indonesia/api/districts/${req.params.cityId}.json`
  )

  res.json(data)
})

const getVillageByDistrict = asyncHandler(async (req, res) => {
  const { data } = await axios.get(
    `https://emsifa.github.io/api-wilayah-indonesia/api/villages/${req.params.districtId}.json`
  )

  res.json(data)
})

export {
  createAddress,
  getAllAddresses,
  getAddressById,
  getMyAddress,
  updateAddress,
  setAddressAsMain,
  getMainAddress,
  removeAddress,
  getProvince,
  getCityByProvince,
  getDistrictByCity,
  getVillageByDistrict,
}
