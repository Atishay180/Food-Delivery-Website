import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import { ApiError } from "../utils/ApiError.js"

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

//register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body

    try {
        if (name === "" || password === "" || email === "") {
            throw new ApiError(400, "All fields are required")
        }

        const exists = await User.findOne({ email })

        if (exists) {
            throw new ApiError(400, "User already exists")
        }

        //validate email format & strong password
        if (!validator.isEmail(email)) {
            throw new ApiError(400, "Please enter valid email")
        }

        if (password.length < 8) {
            throw new ApiError(400, "Please enter a strong password")
        }

        //hash user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        if (!newUser) {
            throw new ApiError(400, "An error occured while registering the user, please try again ")
        }

        const token = createToken(newUser._id)

        return res.json({ success: true, token })
    } catch (error) {
        console.log("User Already exists");
        res.json({ success: false, message: "Error" })
    }
}

//login user 
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            throw new ApiError(400, "User does not exist")
        }

        const isMatched = await bcrypt.compare(password, user.password)

        if (!isMatched) {
            throw new ApiError(400, "You have entered Invalid Credentials")
        }

        const token = createToken(user._id)

        return res.json({ success: true, token })
    } catch (error) {
        console.log("Failed to login");
        res.json({ success: false, message: "Error" })
    }
}
export { loginUser, registerUser }