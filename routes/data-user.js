import express from 'express'
import dataUserController from '../controllers/dataUserController.js'
import { checkUser } from '../middleware/auth.js'
const router = express.Router()
router.get('/userId/:id', checkUser, dataUserController.getDataUser)
router.post('/add-cart/:userId', checkUser, dataUserController.addCart)
router.delete('/remove-product/:userId', checkUser, dataUserController.removeProduct)
router.post('/add-history', checkUser, dataUserController.addOrderHistory)
export default router