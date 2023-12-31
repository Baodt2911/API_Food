import userDB from "../models/user.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import refreshTokenDB from "../models/refreshToken.js"
import dataUserDB from "../models/data-user.js"
const userController = {
    getAllUser: async (req, res) => {
        const existingUsers = await userDB.find()
        res.status(200).json({ data: existingUsers })
    },
    register: async (req, res) => {
        const { displayName, photoURL, email, password, phoneNumber, address } = req.body
        const existingUser = await userDB.findOne({ email })
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({ message: 'Email already exists' });
            }
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const { _id: userId } = await userDB.create({
            displayName,
            photoURL,
            email,
            password: hashedPassword,
            phoneNumber,
            address
        })
        await dataUserDB.create({ userId }) // Store data user
        return res.status(200).json({ message: "Register successfully" })
    },
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user._id || user.id,
                role: user.role
            }
            ,
            process.env.ACCESSTOKEN_KEY,
            {
                expiresIn: '2m'
            }
        )
    },
    generateRefreshToken: async (user) => {
        const currentDate = new Date()
        const expiresToken = Math.floor(currentDate.getTime() / 1000) + (15 * 24 * 60 * 60) // days in seconds
        const refreshToken = jwt.sign(
            {
                id: user._id || user.id,
                role: user.role
            },
            process.env.REFRESHTOKEN_KEY,
            {
                expiresIn: expiresToken
            }
        )
        //Save refreshToken to DB
        const newRefreshToken = new refreshTokenDB({
            userId: user._id || user.id,
            refreshToken,
            expiresAt: new Date(expiresToken * 1000) // Convert seconds to milliseconds
        })
        await newRefreshToken.save()
        return refreshToken
    },
    login: async (req, res) => {
        const existingUser = await userDB.findOne({ email: req.body.email })
        if (!existingUser) {
            return res.status(404).json({ message: "Email does'nt exist" })
        }
        const { password, ...other } = existingUser._doc
        const checkPassword = await bcrypt.compare(req.body.password, password)
        if (!checkPassword) {
            return res.status(401).json({ message: "Wrong password" })
        }
        const accessToken = userController.generateAccessToken(other)
        const refreshToken = await userController.generateRefreshToken(other)
        // res.cookie('refreshToken', refreshToken, {
        //     httpOnly: true,
        //     secure: false,
        //     path: '/',
        //     sameSite: 'strict'
        // });
        res.status(200).json({
            user: other,
            accessToken,
            refreshToken
        })
    },
    requestRefreshToken: async (req, res) => {
        const { authorization: token } = req.headers
        const refreshToken = token.split(" ")[1]
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not provided' });
        }
        const isRefreshToken = await refreshTokenDB.findOne({ refreshToken })
        if (!isRefreshToken) {
            return res.status(403).json({ message: 'Refresh token is not valid' })
        }
        jwt.verify(refreshToken, process.env.REFRESHTOKEN_KEY, async (err, user) => {
            if (err) {
                return res.status(403).json(err)
            }
            //Create new accesstoken,refreshtoken 
            const newAccessToken = userController.generateAccessToken(user)
            const newRefreshToken = await userController.generateRefreshToken(user)
            // res.cookie('refreshToken', newRefreshToken, {
            //     httpOnly: true,
            //     secure: false,
            //     path: '/',
            //     sameSite: 'strict'
            // });
            res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
        })
    },
    updateProfile: async (req, res) => {
        try {
            const existingUser = await userDB.findById(req.params.id)
            await existingUser.updateOne({ $set: req.body })
            const existingUserUpdated = await userDB.findById(req.params.id)
            const { password, ...other } = existingUserUpdated._doc
            res.status(200).json({
                message: "Update successfully",
                data: other
            })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { email, phoneNumber, newPassword } = req.body
            const existingUser = await userDB.findOne({ $or: [{ email }, { phoneNumber }] })
            if (!existingUser) {
                return res.status(404).json({ message: "Email or phone number does'nt exist" })
            }
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            await existingUser.updateOne({ $set: { password: hashedPassword } })
            res.status(200).json({ message: "Changed password" })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    userLogout: async (req, res) => {
        const { authorization: token } = req.headers
        const refreshToken = token.split(" ")[1]
        const test = await refreshTokenDB.findOneAndDelete({ refreshToken })
        res.status(200).json(test)
    }
}
export default userController