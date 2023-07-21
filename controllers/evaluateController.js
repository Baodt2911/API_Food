import dataUserDB from "../models/data-user.js"
import evaluate_foodDB from "../models/evaluate_food.js"
import evaluate_restaurantDB from "../models/evaluate_restaurant.js"
const evaluateController = {
    getEvaluates: async (req, res) => {
        try {
            const { type } = req.query
            let existingEvaluate = null
            if (type === 'dishes') {
                existingEvaluate = await evaluate_foodDB.find({ dishes: req.params.id }).populate({
                    path: 'userId',
                    select: ['displayName', 'photoURL']
                })
            } else if (type === 'restaurants') {
                existingEvaluate = await evaluate_restaurantDB.find({ restaurant: req.params.id }).populate({
                    path: 'userId',
                    select: ['displayName', 'photoURL']
                })
            } else {
                return res.status(404).json('Type unknow!')
            }
            res.status(200).json({ data: existingEvaluate })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    addEvaluateFood: async (req, res) => {
        try {
            const { userId, rate, text } = req.body
            const { cart } = await dataUserDB.findOne({ userId }, 'cart')
            cart.forEach(async (data) => {
                await evaluate_foodDB.create({
                    userId, rate, text,
                    dishes: data.product
                })
            })
            res.status(200).json('Added evaluate')
        } catch (error) {
            res.status(500).json(error)
        }
    },
    addEvaluateRestaurant: async (req, res) => {
        try {
            const { userId, rate, text } = req.body
            const { cart } = await dataUserDB.findOne({ userId }, 'cart').populate({
                path: 'cart',
                populate: {
                    path: 'product',
                    model: 'dishes',
                    select: 'restaurant'
                }
            })
            cart.forEach(async (data) => {
                await evaluate_restaurantDB.create({
                    userId, rate, text,
                    restaurant: data.product.restaurant
                })
            })
            res.status(200).json('Added evaluate')
        } catch (error) {
            res.status(500).json(error)
        }
    },
    deleteEvaluate: async (req, res) => {
        try {
            const { type } = req.query
            if (type === 'dishes') {
                await evaluate_foodDB.findByIdAndDelete(req.params.id)
            } else if (type === 'restaurant') {
                await evaluate_restaurantDB.findByIdAndDelete(req.params.id)
            } else {
                return res.status(404).json('Type unknow!')
            }
            res.status(200).json("Deleted successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    }
}
export default evaluateController