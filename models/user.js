import mongoose, { Schema } from "mongoose";
const userDB = mongoose.model('user',
    new Schema({
        displayName: {
            type: String,
            minlength: 6,
            maxlength: 30
        },
        photoURL: {
            type: String,
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
            unique: true,
        },
        address: {
            type: String,
        },
        isNewUser: {
            type: Boolean,
            default: true
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