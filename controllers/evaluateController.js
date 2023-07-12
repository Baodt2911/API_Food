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
            const existingEvaluate = await evaluateDB.find({ dishes: req.params.id }).populate({
                path: 'userId',
                select: ['displayName', 'photoURL']
            })
            res.status(200).json({ data: existingEvaluate })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    addEvaluate: async (req, res) => {
        try {
            const isDishes = await dishesDB.findById(req.body.dishes)
            if (!isDishes) {
                return res.status(404).json('Not found Dishes')
            }
            const existingEvaluate = await evaluateDB.create(req.body)
            res.status(200).json(existingEvaluate)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    deleteEvaluate: async (req, res) => {
        try {
            await evaluateDB.findByIdAndDelete(req.params.id)
            res.status(200).json("Deleted successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    }
}
export default evaluateController