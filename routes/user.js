import express from "express";
import { userController } from "../controllers/index.js";
import { checkAdmin } from "../middleware/auth.js";
const router = express.Router()
router.get('/users', checkAdmin, userController.getAllUser)
router.post('/login', userController.login)
router.post('/register', userController.register)
router.post('/refresh', userController.requestRefreshToken)
router.post('/logout', checkAdmin, userController.userLogout)
export default router