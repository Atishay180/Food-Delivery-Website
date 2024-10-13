import express from "express"
import {addFood, listFood, removeFood} from "../controllers/food.controller.js"

const foodRouter = express.Router();

foodRouter.post("/add", addFood)
foodRouter.get("/list", listFood)
foodRouter.post("/remove", removeFood)

export default foodRouter