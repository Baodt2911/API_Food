import express from 'express'
import { verificationController } from '../controllers/index.js'
const router = express.Router()
router.post('/otp', verificationController.verificationOtp)
router.post('/email-code', verificationController.sendToEmail)
router.post('/sms-code', verificationController.sendToSMS)
export default router