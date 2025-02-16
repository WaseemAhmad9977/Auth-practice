import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    fullname: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // trim: true,
        required: true
    }
}, {timestamps: true})

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password,12)
    next()
})

const userModel = model('User', userSchema);
export default userModel;