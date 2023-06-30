import express from 'express'
import { dishesController } from '../controllers/index.js'
import { checkAdmin } from '../middleware/auth.js'
const router = express.Router()
router.get('/', dishesController.getAlldishes)
router.get('/id/:id', dishesController.getDishesById)
router.get('/search', dishesController.searchDishes)
router.post('/add', checkAdmin, dishesController.addDishes)
router.put('/update/:id', checkAdmin, dishesController.updateDishes)
router.delete('/delete/:id', checkAdmin, dishesController.deleteDishes)
export default router