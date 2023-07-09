import mongoose, { Schema } from "mongoose";
const userDB = mongoose.model('user',
    new Schema({
        displayName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 30
        },
        photoURL: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            unique: true
        },
        address: {
            type: String,
        },
        role: {
            type: String,
            default: 'user'
        }
    },
        {
            timestamps: true
        }
    )
)
export default userDB