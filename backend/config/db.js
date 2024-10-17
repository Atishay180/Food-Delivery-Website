import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.log(`Error connection to mongoDB: ${error.message}`);
        process.exit(1);
    }
}