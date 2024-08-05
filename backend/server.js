import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import dotenv from "dotenv"
import foodRouter from "./routes/food.routes.js"
import userRouter from "./routes/user.routes.js"

dotenv.config({
    path: `./.env`
})

//app config
const app = express()

//middleware
app.use(express.json())
app.use(cors())

//db connection
connectDB();

//api endpoints
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)

app.get("/", (req, res) => {
    res.send("API Working")
})

app.listen(process.env.PORT || 4000, () => {
    console.log(`Service is running at port : ${process.env.PORT}`);
})


//mongodb+srv://atishayjain8807:8807jain@cluster0.b28bhtq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0