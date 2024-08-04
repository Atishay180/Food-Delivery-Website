import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        .then(() => console.log(`MongoDB Connected`))
    } catch (error) {
        console.log("MONGODB connection error", error);
    }
}