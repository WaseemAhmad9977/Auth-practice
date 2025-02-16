import { Router } from "express";
import { signup, login, userDetail } from "../controller/user.controller.js";

const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.get('/details', userDetail)

export default userRouter