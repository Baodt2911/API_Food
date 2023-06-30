import mongoose, { Schema } from "mongoose";
const refreshTokenDB = mongoose.model('refreshToken',
    new Schema({
        userId: { type: String, required: true },
        refreshToken: { type: String, required: true },
        expiresAt: { type: Date, default: Date.now, expires: 0 }
    })
)
export default refreshTokenDB