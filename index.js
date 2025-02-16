import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
mongoose.connect(process.env.DB_URL)
.then(()=> console.log("Db connected "))
.catch(()=> console.log("Db failed"))

import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

const app = express()
app.listen(process.env.PORT, ()=> console.log("Server started..."))

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// started routes...
import userRouter from './routes/user.routes.js'

app.use('/user', userRouter)