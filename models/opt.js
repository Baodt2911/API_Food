import mongoose, { Schema } from "mongoose";
const OTPSchema = mongoose.model('otp',
    new Schema({
        phone: String,
        email: String,
        otp: { type: String, required: true },
        expiresIn: { type: Date, default: Date.now, expires: 60 }
    })
)
export default OTPSchema