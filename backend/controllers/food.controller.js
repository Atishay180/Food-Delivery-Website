import { Food } from "../models/food.model.js"
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
            return res.json({ success: false, message: "Error while adding the food" })
        }
        return res.json({ success: true, message: "Dish Added" })
    } catch (error) {
        console.log("Something went wrong, cannot add the dish");
        res.json({ success: false, message: "Something went wrong, cannot add the dish" })
    }
}

//all food list
const listFood = async (req, res) => {
    try {
        const foods = await Food.find({});

        if (!foods) {
            return res.json({ success: false, message: "Error in fetching the food list" })
        }

        return res.json({ success: true, data: foods })
    } catch (error) {
        console.log("Cannot fetch the food list");
        res.json({ success: false, message: "Cannot fetch the food list" })
    }
}

//remove food items
const removeFood = async (req, res) => {
    try {
        const foodId = req.body.id

        if (!foodId) {
            res.json({ success: false, message: "Cannot find the dish" })
        }

        const food = await Food.findById(foodId)
        if (!food) {
            res.json({ success: false, message: "Can't find the food item, please try again later" })
        }
        fs.unlink(`uploads/${food.image}`, () => { })  //delete image from the folder

        const removeFood = await Food.findByIdAndDelete(foodId)

        if (!removeFood) {
            res.json({ success: false, message: "Can't remove the food items, please try again later" })
        }

        return res.json({ success: true, message: "Dish removed successfully" })
    } catch (error) {
        console.log("Error while removing food items");
        res.json({ success: false, message: "Error while removing food items" })
    }
}

export { addFood, listFood, removeFood }