import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary"

import foodRouter from "./routes/food.routes.js"
import userRouter from "./routes/user.routes.js"
import cartRouter from "./routes/cart.routes.js"
import orderRouter from "./routes/order.routes.js"

dotenv.config({
    path: `./.env`
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//app config
const app = express()

//middleware
app.use(express.json({ limit: "5mb" }))

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

//db connection
connectDB();

//api endpoints
app.use("/api/food", foodRouter)
// app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

app.get("/", (req, res) => {
    res.send("API Working")
})

app.listen(process.env.PORT || 4000, () => {
    console.log(`Service is running at port : ${process.env.PORT}`);
})
