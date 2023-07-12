import mongoose, { Schema } from "mongoose";
const dishesDB = mongoose.model('dishes',
    new Schema({
        name: {
            type: String,
            required: true, //NOT NULL
        },
        price: {
            type: Number,
            required: true //NOT NULL
        },
        photoURL: {
            type: String,
            required: true,
            unique: true
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'restaurants'
        },
        description: {
            type: String,
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
        order: {
            type: Number,
            default: 0
        }
    },
        {
            timestamps: true
        }
    )
)
export default dishesDB