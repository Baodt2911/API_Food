import express from "express";
import { restaurantsController } from "../controllers/index.js";
import { checkAdmin } from "../middleware/auth.js";
const router = express.Router()
router.get('/', restaurantsController.getAllRestaurants)
router.get('/id/:id', restaurantsController.getRestaurantById)
router.get('/by-dishes/:id', restaurantsController.getRestaurantByDishes)
router.get('/search', restaurantsController.searchRestaurant)
router.get('/popular', restaurantsController.getRestaurantPopular)
router.post('/add', checkAdmin, restaurantsController.addRestaurant)
router.put('/update/:id', checkAdmin, restaurantsController.updateRestaurant)
router.delete('/delete/:id', checkAdmin, restaurantsController.deleteRestaurant)
export default router