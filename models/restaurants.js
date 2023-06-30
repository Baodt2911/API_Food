import mongoose, { Schema } from "mongoose";
const restaurantsDB = mongoose.model('restaurants',
    new Schema({
        name: {
            type: String,
            required: true, //NOT NULL
            unique: true
        },
        imageURL: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true,
            unique: true //NOT NULL
        },
        description: {
            type: String,
            required: true
        },
        rate: {
            type: Number,
            required: true
        },
        menu: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'dishes'
            }
        ]
    },
        {
            timestamps: true
        }
    )
)
export default restaurantsDB