import mongoose, { Schema } from "mongoose";
const evaluate_restaurantDB = mongoose.model('evaluate_restaurant',
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
        restaurant: {
            type: String,
            required: true
        }
    },
        {
            timestamps: true,
        }
    ),
)
export default evaluate_restaurantDB