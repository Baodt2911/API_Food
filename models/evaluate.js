import mongoose, { Schema } from "mongoose";
const evaluateDB = mongoose.model('evaluate',
    new Schema({
        userId: {
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
            type: String,
            required: true
        }
    },
        {
            timestamps: true
        }
    )
)
export default evaluateDB