import express from 'express'
import { dataUserController } from '../controllers/index.js'
import { checkUser } from '../middleware/auth.js'
const router = express.Router()
router.get('/userId/:id', checkUser, dataUserController.getDataUser)
router.put('/add-cart/:id', checkUser, dataUserController.addCart)
router.put('/remove-product/:id', checkUser, dataUserController.removeProduct)
router.put('/clear-cart/:id', checkUser, dataUserController.clearCart)
router.put('/add-history/:id', checkUser, dataUserController.addOrderHistory)
export default router