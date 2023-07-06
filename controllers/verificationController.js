import nodemailer from 'nodemailer'
import twilio from 'twilio'
import bcrypt, { compare } from 'bcrypt'
import OTPSchema from '../models/opt.js'
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
        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Food Deliver - Verification code',
            html: `<p>Your confirmation code is: <ins><b>${confirmationCode}</b></ins></p>`
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