import dishesDB from "../models/dishes.js"
import restaurantsDB from "../models/restaurants.js"

const restaurantsController = {
    getAllRestaurants: async (req, res) => {
        try {
            const { type } = req.query
            let restaurants = await restaurantsDB.find()
            if (type === 'menu') {
                restaurants = await restaurantsDB.find().populate('menu')
            }
            res.status(200).json({ data: restaurants })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getRestaurantById: async (req, res) => {
        try {
            const { id } = req.params
            const restaurants = await restaurantsDB.findById(id).populate('menu')
            res.status(200).json(restaurants)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getRestaurantByDishes: async (req, res) => {
        try {
            const { id } = req.params
            const restaurants = await restaurantsDB.findOne({ menu: { $in: [id] } })
            res.status(200).json(restaurants)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getRestaurantPopular: async (req, res) => {
        try {
            const { limit } = req.query
            const convertLimitToInt = parseInt(limit)
            //use aggregate and sample  get random restaurant for popular
            let restaurants = await restaurantsDB.aggregate([{ $sample: { size: 6 } }])
            if (convertLimitToInt) {
                if (convertLimitToInt < 6 || convertLimitToInt > 30) {
                    return res.status(404).json('The limit is between 6 and 30')
                }
                restaurants = await restaurantsDB.aggregate([{ $sample: { size: convertLimitToInt } }])
            }
            res.status(200).json({ data: restaurants })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    searchRestaurant: async (req, res) => {
        try {
            const { q: querySearch, order } = req.query
            if (!querySearch) {
                return res.status(404).json("No result is found")
            }
            let resultsRestaurant = await restaurantsDB.find({ name: { $regex: querySearch, $options: 'i' } })
            if (order === 'suggest') {
                const firstWord = querySearch.split(" ")[0]
                resultsRestaurant = await restaurantsDB.find({
                    name: {
                        $regex: new RegExp(`^${firstWord}`),//query firstWord
                        $options: 'i'
                    }
                }, 'name')//Get fieldName 
            }
            res.status(200).json({ data: resultsRestaurant })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    addRestaurant: async (req, res) => {
        try {
            const restaurants = await restaurantsDB.create(req.body)
            res.status(200).json(restaurants)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    updateRestaurant: async (req, res) => {
        try {
            const restaurants = await restaurantsDB.findById(req.params.id)
            await restaurants.updateOne({ $set: req.body })
            res.status(200).json("Update successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    },
    deleteRestaurant: async (req, res) => {
        try {
            await dishesDB.updateMany({ restaurant: req.params.id }, { restaurant: null })
            await restaurantsDB.findByIdAndDelete(req.params.id)
            res.status(200).json("Deleted successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    }
}
export default restaurantsController