import { User } from "../models/user.model.js"

//add items to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.body.userId
        if (!userId) {
            return res
                .status(401)
                .json("Unauthorized request, please login to continue")
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
            { cartData }
        )

        return res
            .status(200)
            .json({ success: true, message: "Items added to cart" })
    } catch (error) {
        console.log("Error in addToCart controller: ", error.message);
        return res
            .status(400)
            .json({ success: false, message: "Cannot add items to cart" })
    }
}

//remove cart items
const removeFromCart = async (req, res) => {
    try {
        const userId = req.body.userId
        let userData = await User.findById(userId)
        let cartData = await userData.cartData

        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }

        await User.findByIdAndUpdate(
            userId,
            { cartData }
        )

        return res
            .status(200)
            .json({ success: true, message: "Item removed from cart" })

    } catch (error) {
        console.log("Error in removeFromCart controller: ", error.message);
        return res
            .status(400)
            .json({ success: false, message: "Can't remove the item, Please try again" })
    }
}

//fetch cart data
const getCart = async (req, res) => {
    try {
        const userId = req.body.userId
        const userData = await User.findById(userId);

        const cartData = await userData.cartData;

        return res
            .status(200)
            .json({ success: true, cartData })
    } catch (error) {
        console.log("Cannot get the cart data");
        return res
            .status(400)
            .json({ success: false, message: "Cannot get the cart data" })
    }
}

export { addToCart, removeFromCart, getCart }