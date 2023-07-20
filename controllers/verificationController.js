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
        const isUser = await userDB.find({ email })
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
                <title>Mã OTP đặt lại mật khẩu</title>
            </head>
            <body style="font-family: Arial, sans-serif;">
            
                <h2>Mã OTP đặt lại mật khẩu</h2>
            
                <p>Kính gửi <strong>${isUser[0].displayName},</strong></p>
            
                <p>Bạn đang nhận được mã OTP để xác thực việc đặt lại mật khẩu cho tài khoản của bạn.</p>
            
                <p>Mã OTP của bạn là: <strong style="font-size: 18px; background-color: #f0f0f0; padding: 5px;">${confirmationCode}</strong></p>
            
                <p>Mã này chỉ có giá trị trong vòng 1 phút kể từ khi email được gửi đi, vui lòng không chia sẻ mã này với bất kỳ ai.</p>
            
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu hoặc không thực hiện hành động này, vui lòng bỏ qua email này.</p>
            
                <p>Nếu bạn gặp bất kỳ vấn đề nào hoặc cần hỗ trợ, hãy liên hệ với chúng tôi qua email <a href="mailto:food-delivery-support@example.com">food-delivery-support@example.com</a>.</p>
            
                <p>Xin cảm ơn.</p>
            
                <p>Trân trọng,</p>
                <p><strong>Nhóm hỗ trợ của chúng tôi</strong></p>
            
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