import { Food } from "../models/food.model.js"
import { ApiError } from "../utils/ApiError.js"
import fs from "fs"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


//add food item
const addFood = asyncHandler(async (req, res) => {
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
    return res
        .status(200)
        .json(new ApiResponse(200, food, "Food added successfully"))
})

//all food list
const listFood = asyncHandler(async (req, res) => {
    const foods = await Food.find({});
    
    if(!foods){
        throw new ApiError(400, "Error in fetching the food list")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, foods, "Food items fetched successfully"))
})

//remove food items
const removeFood = asyncHandler(async(req, res) => {
    const foodId = req.body.id

    if(!foodId){
        throw new ApiError(404, "Cannot find the food")
    }

    const food = await Food.findById(foodId)
    if(!food){
        throw new ApiError(404, "Can't find the food item, please try again later")
    }
    fs.unlink(`uploads/${food.image}`, () => {})  //delete image from the folder

    const remmoveFood = await Food.findByIdAndDelete(foodId)

    if(!removeFood){
        throw new ApiError(400, "Can't remove the food items, please try again later")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, "Successfully removed food item"))
})

export { addFood, listFood, removeFood }