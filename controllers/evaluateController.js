import dishesDB from "../models/dishes.js"
import evaluateDB from "../models/evaluate.js"
const evaluateController = {
    getAllEvaluate: async (req, res) => {
        try {
            const existingEvaluate = await evaluateDB.find()
            res.status(200).json({ data: existingEvaluate })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getAllEvaluateByDishes: async (req, res) => {
        try {
            const existingEvaluate = await evaluateDB.find({ dishes: req.params.id })
            res.status(200).json({ data: existingEvaluate })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    addEvaluate: async (req, res) => {
        try {
            const existingEvaluate = await evaluateDB.create(req.body)
            if (req.body.dishes) {
                const existingDishes = await dishesDB.findById(req.body.dishes)
                await existingDishes.updateOne({ $push: { evaluate: existingEvaluate._id } })
            }
            res.status(200).json(existingEvaluate)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    deleteEvaluate: async (req, res) => {
        try {
            await dishesDB.updateOne(
                { evaluate: req.params.id },
                { $pull: { evaluate: req.params.id } }
            )
            await evaluateDB.findByIdAndDelete(req.params.id)
            res.status(200).json("Deleted successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    }
}
export default evaluateController