import nodemailer from 'nodemailer'
import twilio from 'twilio'
import bcrypt, { compare } from 'bcrypt'
import OTPSchema from '../models/opt.js'
import userDB from '../models/user.js'
const verificationController = {
    generateConfirmationCode: () => {
        const confirmationCode = []
        while (confirmationCode.length < 4) {
            const code = Math.floor(Math.random() * 10)
            if (!confirmationCode.includes(code)) {
                confirmationCode.push(code)
            }
        }
        return confirmationCode.join('')
    },
    insertOtp: async ({ confirmationCode, email, phone }) => {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashOtp = await bcrypt.hash(confirmationCode, salt)
            const Otp = await OTPSchema.create({
                phone,
                email,
                otp: hashOtp
            })
            return Otp ? 1 : 0 // 1-Success // 0-Failure
        } catch (error) {
            console.log(error)
        }
    },
    verificationOtp: async (req, res) => {
        try {
            const { email, phone, otp: otpClient } = req.body
            const isUser = await userDB.find({ $or: [{ email }, { phoneNumber: phone }] })
            if (!isUser) {
                return res.status(404).json({ message: "Email or phone number does'nt exist" })
            }
            const existingOtp = await OTPSchema.find({ $or: [{ email }, { phone }] })
            if (!existingOtp.length) {
                return res.status(404).json({ status: 'EXPRISED', message: "Expired OTP" })
            }
            const lastOtp = existingOtp[existingOtp.length - 1]
            const { otp } = lastOtp._doc
            const compareOtp = await bcrypt.compare(otpClient, otp)
            if (!compareOtp) {
                return res.status(401).json({ status: 'NOT', message: "Invalid OTP" })
            }
            res.status(200).json({ status: 'OK', message: "Valid OTP" })
        } catch (error) {
            res.status(404).join(error)
        }
    },
    sendToEmail: async (req, res) => {
        const { email } = req.body
        const isUser = await userDB.findOne({ email })
        if (!isUser) {
            return res.status(404).json({ message: "Email does'nt exist" })
        }
        const confirmationCode = verificationController.generateConfirmationCode()
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        })
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Food Deliver - OTP',
            html: `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>OTP for Password Reset</title>
            </head>
            <body style="font-family: Arial, sans-serif;">
            
                <h2>OTP for Password Reset</h2>
            
                <p>Dear <strong>${isUser.displayName},</strong></p>
            
                <p>You are receiving an OTP to authenticate the password reset for your account.</p>
            
                <p>Your OTP is: <strong style="font-size: 18px; background-color: #f0f0f0; padding: 5px;">${confirmationCode}</strong></p>
            
                <p>This OTP is valid for 1 minutes from the time this email is sent. Please do not share this OTP with anyone.</p>
            
                <p>If you did not request a password reset or you're not performing this action, please disregard this email.</p>
            
                <p>If you encounter any issues or need assistance, please contact us via email at <a href="mailto:food-delivery-support@example.com">food-delivery-support@example.com</a>.</p>
            
                <p>Thank you.</p>
            
                <p>Best regards,</p>
                <p><strong>Our Support Team</strong></p>
            
            </body>
            </html>            
            `
        })
        const element = await verificationController.insertOtp({ email, confirmationCode, phone: '' })
        return res.status(200).json({
            element
        })
    },
    sendToSMS: async (req, res) => {
        const accountSid = process.env.ACCOUNT_SID;
        const authToken = process.env.AUTH_TOKEN;
        const client = twilio(accountSid, authToken);
        client.messages
            .create({
                body: 'Hello from Twilio!',
                from: '0348657408',
                to: '0332350491'
            })
            .then(message => console.log(message.sid));
    }
}
export default verificationController