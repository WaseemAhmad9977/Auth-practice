import dotenv from 'dotenv'
dotenv.config()

import userModel from "../model/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const getToken = (payload)=> {
    const AccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '15m' })
    const RefreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: '7d' })

    return {
        AccessToken,
        RefreshToken
    }
    
}

export const signup = async (req, res)=> {
    try {
        const newUser = new userModel(req.body)
        await newUser.save()
        res.json(newUser)

    } catch (err) {
        res.status(500).json({message: err.message})
        
    }
}

export const login = async (req, res)=> {
    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })


        if(!user)
            return res.status(404).json({ message: "User not found !"})

        const isLogin = await bcrypt.compare(password, user.password)
  
        if(!isLogin)
            return res.status(401).json({message: "Incorrect password !"})

        const payload = {
            fullname: user.fullname,
            email: user.email,
            id: user._id
        }

        const { AccessToken, RefreshToken } = getToken(payload)

        res.cookie('accessToken', AccessToken, {
            secure: true,
            domain: 'localhost',
            httpOnly: true,
            maxAge: 840000,
        })

        res.cookie('refreshToken', RefreshToken, {
            secure: true,
            domain: 'localhost',
            httpOnly: true,
            maxAge: 518400000,
        })

        res.json({message: "Login Successfully...!"})

    } catch (err) {
        res.status(500).json({message: err.message})
        
    }
}

export const userDetail = async (req, res)=> {
    try {
        const { accessToken } = req.cookies

        if(!accessToken)
            return res.status(401).send("Unathorized")

        const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN)

        res.json(user)

    } catch (err) {
        res.status(500).json({message: err.message})
        
    }
}