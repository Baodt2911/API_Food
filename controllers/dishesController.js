import dishesDB from "../models/dishes.js";
import evaluateDB from "../models/evaluate.js";
import restaurantsDB from "../models/restaurants.js";
const dishesController = {
    getAlldishes: async (req, res) => {
        try {
            const dishes = await dishesDB.find().populate({
                path: 'restaurant',
                select: 'name'
            })
            res.status(200).json({ data: dishes })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getDishesById: async (req, res) => {
        try {
            const { id } = req.params
            const dishes = await dishesDB.findById(id)
            res.status(200).json(dishes)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getDishesPopular: async (req, res) => {
        try {
            const { limit } = req.query
            const convertLimitToInt = parseInt(limit)
            //use aggregate and sample  get random dishes for popular
            let dishes = await dishesDB.aggregate([
                { $sample: { size: 6 } },
                {
                    //Use lookup to get data from collection references
                    $lookup: {
                        from: 'restaurants',//collection or table
                        localField: 'restaurant',// fieldName current
                        foreignField: '_id', //fieldName collection or table 
                        as: 'restaurant' //fieldName new 
                    }
                }
            ])
            if (convertLimitToInt) {
                if (convertLimitToInt < 6 || convertLimitToInt > 30) {
                    return res.status(404).json('The limit is between 6 and 30')
                }
                dishes = await dishesDB.aggregate([
                    { $sample: { size: convertLimitToInt } },
                    {
                        //Use lookup to get data from collection references
                        $lookup: {
                            from: 'restaurants',//collection or table
                            localField: 'restaurant',// fieldName current
                            foreignField: '_id', //fieldName collection or table 
                            as: 'restaurant' //fieldName new 
                        }
                    }
                ])
            }
            res.status(200).json({ data: dishes })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    searchDishes: async (req, res) => {
        try {
            const { q: querySearch, order } = req.query
            if (!querySearch) {
                return res.status(404).json("No result is found")
            }
            let resultsDishes = await dishesDB.find({ name: { $regex: querySearch, $options: 'i' } }).populate({
                path: 'restaurant',
                select: 'name'
            })
            if (order === 'suggest') {
                const firstWord = querySearch.split(" ")[0]
                resultsDishes = await dishesDB.find({
                    name: {
                        $regex: new RegExp(`^${firstWord}`),//query firstWord
                        $options: 'i'
                    }
                }, 'name')//Get fieldName 
            }
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
            await evaluateDB.deleteMany({ dishes: req.params.id })
            await dishesDB.findByIdAndDelete(req.params.id)
            res.status(200).json("Deleted successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    }
}
export default dishesController