import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { routerRestaurants, routerUser, routerDishes, routerEvaluate } from './routes/index.js'
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST'],
    credentials: true
}))
app.use(morgan('combined'))
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/auth', routerUser)
app.use('/api/v1/restaurants', routerRestaurants)
app.use('/api/v1/dishes', routerDishes)
app.use('/api/v1/evaluate', routerEvaluate)
app.use('/', (req, res) => {
    res.send('Welcome to Baodt2911')
})
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, async () => {
            console.log("***Connect successfully***");
            console.log(`PORT: http://localhost:${PORT}`);
        })
    })
    .catch((error) => {
        const { code } = error
        if (code === 8000) {
            console.log('***Wrong database***');
        }
    })