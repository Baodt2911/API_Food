import dataUserDB from "../models/data-user.js"
const dataUserController = {
    getDataUser: async (req, res) => {
        try {
            const { id: userId } = req.params
            const { type } = req.query
            let existingDataUser = null
            if (type === 'cart') {
                existingDataUser = await dataUserDB.findOne({ userId }, 'cart').populate({
                    // Use 3 times populate get product(ref-dishes) continue get restaurant(ref-restaurants) and select field:'name' 
                    // 1 times get cart
                    // 2 times get product(ref-dishes). Because cart is array-object
                    //3 times get restaurant by model restaurants
                    path: 'cart',
                    populate: {
                        path: 'product',
                        model: 'dishes',
                        populate: {
                            path: 'restaurant',
                            model: 'restaurants',
                            select: 'name'
                        }
                    }
                })
            } else if (type === 'history') {
                existingDataUser = await dataUserDB.findOne({ userId }, 'orderHistory').populate({
                    // Use 2 times populate get restaurant(ref-restaurants) and select field:'name'
                    // 1 times get orderHistory
                    //2 times get restaurant by model restaurants
                    path: 'orderHistory',
                    populate: {
                        path: 'restaurant',
                        model: 'restaurants',
                        select: 'name'
                    }
                })
            }
            res.status(200).json(existingDataUser)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    addCart: async (req, res) => {
        try {
            const { userId, cart } = req.body
            const existingDataUser = await dataUserDB.findOne({ userId })
            await existingDataUser.updateOne({
                $push: {
                    cart
                }
            })
            res.status(200).json("Added to cart")
        } catch (error) {
            res.status(500).json(error)
        }
    },
    addOrderHistory: async (req, res) => {
        try {
            const { userId, orderHistory } = req.body
            const existingDataUser = await dataUserDB.findOne({ userId })
            await existingDataUser.updateOne({
                $push: {
                    orderHistory
                }
            })
            res.status(200).json("Added to history")
        } catch (error) {
            res.status(500).json(error)
        }
    },
}
export default dataUserController
