import mongoose, { Schema } from "mongoose";
const dataUserDB = mongoose.model('dataUser',
    new Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        cart: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'dishes'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }],
        orderHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'dishes',
            }
        ]
    })
)
export default dataUserDB