import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  getAllAddresses,
  createAddress,
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
} from '../controllers/addressController.js'

const router = express.Router()

router
  .route('/')
  .get(protect, admin, getAllAddresses)
  .post(protect, createAddress)
router.route('/myaddress').get(protect, getMyAddress)
router
  .route('/:id([0-9a-fA-F]{24})')
  .get(protect, getAddressById)
  .put(protect, updateAddress)
  .delete(protect, removeAddress)
router.route('/main').get(protect, getMainAddress)
router.route('/main/:id([0-9a-fA-F]{24})').put(protect, setAddressAsMain)
router.route('/province').get(getProvince)
router.route('/city/:provinceId').get(getCityByProvince)
router.route('/district/:cityId').get(getDistrictByCity)
router.route('/village/:districtId').get(getVillageByDistrict)

export default router
