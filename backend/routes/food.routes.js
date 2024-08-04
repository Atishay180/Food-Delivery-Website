import express from "express"
import {addFood, listFood, removeFood} from "../controllers/food.controller.js"
import multer from "multer"

const foodRouter = express.Router();

//image storage configuration
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)  //unique file name
    }
})

const upload = multer({storage: storage})

foodRouter.post("/add", upload.single("image"), addFood)
foodRouter.get("/list", listFood)
foodRouter.post("/remove", removeFood)

export default foodRouter