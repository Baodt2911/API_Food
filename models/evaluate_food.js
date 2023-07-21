import mongoose, { Schema } from "mongoose";
const evaluate_foodDB = mongoose.model('evaluate',
    new Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        rate: {
            type: Number,
            required: true
        },
        dishes: {
            type: String,
            required: true
        }
    },
        {
            timestamps: true,
        }
    ),
)
export default evaluate_foodDB