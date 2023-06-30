import express from 'express'
import { evaluateController } from '../controllers/index.js'
import { checkAdmin, checkToken } from '../middleware/auth.js'
const router = express.Router()
router.get('/', evaluateController.getAllEvaluate)
router.get('/:id', evaluateController.getAllEvaluateByDishes)
router.post('/add', checkToken, evaluateController.addEvaluate)
router.delete('/delete/:id', checkAdmin, evaluateController.deleteEvaluate)
export default router