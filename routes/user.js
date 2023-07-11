import express from "express";
import { userController } from "../controllers/index.js";
import { checkAdmin, checkToken } from "../middleware/auth.js";
const router = express.Router()
router.get('/users', checkAdmin, userController.getAllUser)
router.post('/login', userController.login)
router.post('/register', userController.register)
router.put('/update-profile/:id', checkAdmin, userController.updateProfile)
router.post('/refresh', userController.requestRefreshToken)
router.post('/logout', checkToken, userController.userLogout)
export default router