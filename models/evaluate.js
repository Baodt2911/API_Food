import mongoose, { Schema } from "mongoose";
const evaluateDB = mongoose.model('evaluate',
    new Schema({
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        text: {
            type: String,
            required: true
        },
        rate: {
            type: String,
            required: true
        },
        dishes: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'dishes'
        }
    },
        {
            timestamps: true
        }
    )
)
export default evaluateDB