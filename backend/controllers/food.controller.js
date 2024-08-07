import { Food } from "../models/food.model.js"
import { ApiError } from "../utils/ApiError.js"
import fs from "fs"

//add food item
const addFood = async (req, res) => {
    try {
        const image_filename = `${req.file.filename}`

        const { name, description, price, category } = req.body

        const food = await Food.create({
            name,
            description,
            price,
            category,
            image: image_filename
        })

        if (!food) {
            throw new ApiError(400, "Error while creating the Food db")
        }
        return res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//all food list
const listFood = async (req, res) => {
    try {
        const foods = await Food.find({});

        if (!foods) {
            throw new ApiError(400, "Error in fetching the food list")
        }

        return res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//remove food items
const removeFood = async (req, res) => {
    try {
        const foodId = req.body.id

        if (!foodId) {
            throw new ApiError(404, "Cannot find the food")
        }

        const food = await Food.findById(foodId)
        if (!food) {
            throw new ApiError(404, "Can't find the food item, please try again later")
        }
        fs.unlink(`uploads/${food.image}`, () => { })  //delete image from the folder

        const removeFood = await Food.findByIdAndDelete(foodId)

        if (!removeFood) {
            throw new ApiError(400, "Can't remove the food items, please try again later")
        }

        return res.json({ success: true, message: "Food Removed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { addFood, listFood, removeFood }