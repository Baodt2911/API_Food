import express from 'express'
import dataUserController from '../controllers/dataUserController.js'
import { checkUser } from '../middleware/auth.js'
const router = express.Router()
router.get('/userId/:id', checkUser, dataUserController.getDataUser)
router.post('/add-cart', checkUser, dataUserController.addCart)
router.post('/add-history', checkUser, dataUserController.addOrderHistory)
export default router