import { Food } from "../models/food.model.js"
import { v2 as cloudinary } from "cloudinary"

//add food item
const addFood = async (req, res) => {
    try {
        const { name, description, price, category, img } = req.body

        const foodExists = await Food.findOne({ name })
        if (foodExists) {
            return res
                .status(400)
                .json({ success: false, message: "Food item already exists" })
        }

        let imgUrl = null
        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img)
            imgUrl = uploadedResponse.secure_url
        }

        const food = await Food.create({
            name,
            description,
            price,
            category,
            image: imgUrl
        })

        if (!food) {
            return res
                .status(400)
                .json({ success: false, message: "Error while adding the food" })
        }
        return res
            .status(200)
            .json({ success: true, message: "Dish Added" })
    } catch (error) {
        console.log("Error in addFood controller: ", error.message);
        return res
            .status(400)
            .json({ success: false, message: "Cannot add the food item" })
    }
}

//all food list
const listFood = async (req, res) => {
    try {
        const foods = await Food.find({});

        if (!foods) {
            return res
                .status(400)
                .json({ success: false, message: "Error in fetching the food list" })
        }

        return res
            .status(200)
            .json({ success: true, data: foods })
    } catch (error) {
        console.log("Error in listFood controller: ", error.message);
        return res
            .status(400)
            .json({ success: false, message: "Cannot fetch the food list" })
    }
}

//remove food items
const removeFood = async (req, res) => {
    try {
        const foodId = req.body.id

        if (!foodId) {
            return res
                .status(400)
                .json({ success: false, message: "Cannot find the dish" })
        }

        const food = await Food.findById(foodId)
        if (!food) {
            return res
                .status(400)
                .json({ success: false, message: "Can't find the food item, please try again later" })
        }

        //delete image from cloudinary
        if (food.image) {
            const imageId = food.image.split("/").pop().split(".")[0]
            try {
                await cloudinary.uploader.destroy(imageId);
            } catch (err) {
                return res
                    .status(400)
                    .json({ success: false, message: "Error while removing the food items" })
            }
        }

        const removeFood = await Food.findByIdAndDelete(foodId)

        if (!removeFood) {
            return res
                .status(400)
                .json({ success: false, message: "Can't remove the food items, please try again later" })
        }

        return res
            .status(200)
            .json({ success: true, message: "Dish removed successfully" })
    } catch (error) {
        console.log("Error in removeFood controller: ", error.message);
        return res
            .status(400)
            .json({ success: false, message: "Error while removing food items" })
    }
}

export { addFood, listFood, removeFood }