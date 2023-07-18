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
            const { id: userId } = req.params
            const { cart } = req.body
            const existingDataUser = await dataUserDB.findOne({ userId })
            const isNewProduct = await dataUserDB.findOneAndUpdate(
                // find product in cart
                {
                    userId,
                    cart: { $elemMatch: { product: cart.product } }
                    // $elemMatch find object in array
                },
                // update
                {
                    $inc: { "cart.$.quantity": cart.quantity || 1 }
                    // $inc  increment or decrement
                    // $: The positional operator in MongoDB, which represents the matched element in the array based on the previous query condition ({ $elemMatch: { product: cart.product } })
                }
                , { new: true }
            );
            if (!isNewProduct) {
                await existingDataUser.updateOne({
                    $push: {
                        cart
                    }
                })
            }
            res.status(200).json("Added to cart")
        } catch (error) {
            res.status(500).json(error)
        }
    },
    removeProduct: async (req, res) => {
        try {
            const { id: userId } = req.params
            const { cart } = req.body
            const isDeletProduct = await dataUserDB.findOneAndUpdate(
                // find product in cart
                {
                    userId,
                    cart: { $elemMatch: { product: cart.product } }
                    // $elemMatch find object in array
                },
                //update
                {
                    $pull: { cart: { product: cart.product } }
                }, { new: true }
            )
            if (!isDeletProduct) {
                return res.status(404).json('Not found product')
            }
            res.status(200).json("Removed from cart")
        } catch (error) {
            res.status(500).json(error)
        }
    },
    clearCart: async (req, res) => {
        try {
            const { id: userId } = req.params
            await dataUserDB.findOneAndUpdate(
                { userId },
                { $set: { cart: [] } },
                { new: true }
            );
            res.status(200).json("Carts cleaned")
        } catch (error) {
            res.status(500).json(error)
        }
    },
    addOrderHistory: async (req, res) => {
        try {
            const { id: userId } = req.params
            const { cart, orderHistory } = await dataUserDB.findOne({ userId })
            const productId = cart.map(data => data.product)
            const listOrder = []
            productId.forEach(product => {
                if (orderHistory.includes(product)) {
                    return
                } else {
                    listOrder.push(product)
                }
            })
            const existingDataUser = await dataUserDB.findOne({ userId })
            await existingDataUser.updateOne({
                $push: {
                    orderHistory: listOrder
                }
            })
            res.status(200).json("Added to history")
        } catch (error) {
            res.status(500).json(error)
        }
    },
}
export default dataUserController
