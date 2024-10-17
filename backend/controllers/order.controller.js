import { Order } from "../models/order.model.js"
import { User } from "../models/user.model.js"
import Stripe from "stripe"


//place order in stripe
const placeOrder = async (req, res) => {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const frontend_url = process.env.FRONTEND_URL

    try {
        const { userId, items, amount, address } = req.body

        const newOrder = await Order.create({
            userId,
            items,
            amount,
            address
        })

        //clean users cart data
        await User.findByIdAndUpdate(
            userId,
            { cartData: {} }
        )

        //line items: items, quantity and price
        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        //delivery charges
        const deliveryCharge = amount > 499 ? 0 : 50
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        return res
            .status(200)
            .json({ success: true, session_url: session.url })


    } catch (error) {
        console.log("Error in placeOrder controller", error.message);
        return res
            .status(400)
            .json({ success: false, message: "Cannot Process the payment" })
    }
}

//place order in cash on delivery
const placeOrderCod = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        const newOrder = await Order.create({
            userId,
            items,
            amount,
            address
        })

        if (!newOrder) {
            return res
                .status(400)
                .json({ success: false, message: "Error while placing the order in Cash On Delivery! please try again" })
        }

        const userCart = await Order.findByIdAndUpdate(
            userId,
            { cartData: {} }
        )

        return res
            .status(200)
            .json({ success: true, userCart, message: "Order placed successfully, Your food is preparing" })


    } catch (error) {
        console.log("Error in placeOrderCod controller", error.message);
        return res
            .status(400)
            .json({ success: false, message: "Error while placing the order, please try again" })
    }
}

//verifying user order
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await Order.findByIdAndUpdate(
                orderId,
                { payment: true }
            )
            return res
                .status(200)
                .json({ success: true, message: "Payment successful" })
        }
        else {
            await Order.findByIdAndDelete(orderId)
            return res
                .status(200)
                .json({ success: false, message: "Payment Cancelled" })
        }
    } catch (error) {

        console.log("Error in verifyOrder controller", error.message);
        return res
            .status(400)
            .json({ success: false, message: "Error in verifying payment" })
    }
}

//user orders for frontend
const userOrders = async (req, res) => {
    try {
        const userId = req.body.userId;
        const orders = await Order.find({ userId: userId })

        return res
            .status(200)
            .json({ success: true, data: orders })
    } catch (error) {
        console.log("Error in userOrders controller", error.message);
        return res
            .status(400)
            .json({ success: false, message: "Error while fetching user orders" })

    }
}

//listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
        return res
            .status(200)
            .json({ success: true, data: orders })
    } catch (error) {
        console.log("Error in listOrders controller", error.message);
        return res
            .status(400)
            .json({ success: false, message: "Error while listing the orders" })
    }
}

//updating order status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        )
        return res
            .status(200)
            .json({ success: true, message: `Your Order is ${order.status}` })
    } catch (error) {
        console.log("Error in updateStatus controller", error.message);
        return res
            .status(400)
            .json({ success: false, message: "Something went wrong while changing order status" })
    }
}
export { placeOrder, placeOrderCod, verifyOrder, userOrders, listOrders, updateStatus }