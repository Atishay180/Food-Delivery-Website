import { User } from "../models/user.model.js"



//add items to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.body.userId
        if(!userId){
            return res.json("Unauthorized request, please login to continue")
        }

        const userData = await User.findById(userId)

        const cartData = await userData.cartData

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1
        }

        else {
            cartData[req.body.itemId] += 1;
        }

        await User.findByIdAndUpdate(userId,
            {cartData}
        )

        res.json({success: true, message: "Items added to cart"})
    } catch (error) {
        console.log("Cannot add items to cart");
        res.json({success: false, message: "Cannot add items to cart"})
    }
}

//remove cart items
const removeFromCart = async (req, res) => {
    try {
        const userId = req.body.userId
        let userData = await User.findById(userId)
        let cartData = await userData.cartData

        if(cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1;     //decrement
        }

        await User.findByIdAndUpdate(
            userId,
            {cartData}
        )

        res.json({success: true, message: "Item removed from cart"})

    } catch (error) {
        console.log("Can't remove the item, Please try again");
        res.json({success: true, message: "Can't remove the item, Please try again"})
    }
}

//fetch cart data
const getCart = async (req, res) => {
    try {
        const userId = req.body.userId
        const userData = await User.findById(userId);

        const cartData = await userData.cartData;

        res.json({success: true, cartData})
    } catch (error) {
        console.log("Cannot get the cart data");
        res.json({success: false, message: "Cannot get the cart data"})
    }
}

export { addToCart, removeFromCart, getCart }