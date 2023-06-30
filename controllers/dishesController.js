import dishesDB from "../models/dishes.js";
import evaluateDB from "../models/evaluate.js";
import restaurantsDB from "../models/restaurants.js";
const dishesController = {
    getAlldishes: async (req, res) => {
        try {
            const dishes = await dishesDB.find()
            res.status(200).json({ data: dishes })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getDishesById: async (req, res) => {
        try {
            const { id } = req.params
            const dishes = await dishesDB.findById(id)
            res.status(200).json({ dishes })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    searchDishes: async (req, res) => {
        try {
            const { q: querySearch } = req.query
            const resultsDishes = await dishesDB.find({ name: { $regex: querySearch, $options: 'i' } })
            res.status(200).json({ data: resultsDishes })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    addDishes: async (req, res) => {
        try {
            const restaurant = await restaurantsDB.findById(req.body.restaurant)
            if (!restaurant) {
                return res.status(401).json("No restaurant found")
            }
            const dishes = await dishesDB.create(req.body)
            await restaurant.updateOne({ $push: { menu: dishes._id } })
            res.status(200).json(dishes)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    updateDishes: async (req, res) => {
        try {
            const dishes = await dishesDB.findById(req.params.id)
            await dishes.updateOne({ $set: req.body })
            res.status(200).json("Updated successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    },
    deleteDishes: async (req, res) => {
        try {
            await restaurantsDB.updateMany(
                { menu: req.params.id },
                { $pull: { menu: req.params.id } }
            )
            await evaluateDB.updateOne({ dishes: req.params.id }, { dishes: null })
            await dishesDB.findByIdAndDelete(req.params.id)
            res.status(200).json("Deleted successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    }
}
export default dishesController