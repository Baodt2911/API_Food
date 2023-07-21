import express from 'express'
import { evaluateController } from '../controllers/index.js'
import { checkAdmin, checkUser } from '../middleware/auth.js'
const router = express.Router()
router.get('/:id', evaluateController.getEvaluates)
router.post('/add-food', checkUser, evaluateController.addEvaluateFood)
router.post('/add-restaurant', checkUser, evaluateController.addEvaluateRestaurant)
router.delete('/delete/:id', checkAdmin, evaluateController.deleteEvaluate)
export default router