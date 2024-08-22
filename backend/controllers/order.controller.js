import { Order } from "../models/order.model.js"
import { User } from "../models/user.model.js"


//placing user order for frontend
const placeOrder = async (req, res) => {

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

        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80
            },
            quantity: item.quantity
        }))

        //delivery charges
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                }
            },
            quantity: 1
        })

        const session = await Stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        return res.json({ success: true, session_url: session.url })


    } catch (error) {
        console.log("Cannot process the payment");
        res.json({ success: false, message: "Cannot Process the payment" })
    }
}

const placeOrderCod = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        const newOrder = await Order.create({
            userId,
            items,
            amount,
            address
        })

        if(!newOrder){
            return res.json({success: false, message: "Error while placing the order in Cash On Delivery! please try again"})
        }

        const userCart = await Order.findByIdAndUpdate(
            userId,
            {cartData: {}}
        )

        return res.json({success: true, userCart, message: "Order placed successfully, Your food is preparing"})


    } catch (error) {
        return res.json({success: false, message: "Error while placing the order, please try again"})
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await Order.findByIdAndUpdate(
                orderId,
                { payment: true }
            )
            res.json({ success: true, message: "Paid" })
        }
        else {
            await Order.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {

        console.log("Error while making payment");
        res.json({success: false, message: "Error while making payment"})
    }
}

//user orders for frontend
const userOrders = async (req, res) => {
    try {
        const userId = req.body.userId;
        const orders = await Order.find({userId: userId})

        res.json({success: true, data: orders})
    } catch (error) {
        console.log("Error while fetching user orders");
        res.json({success: false, message: "Error while fetching user orders"})
        
    }
}

//listing orders for admin panel
const listOrders =  async (req, res) => {
    try {
        const orders = await Order.find({})
        res.json({success: true, data: orders})
    } catch (error) {
        console.log("Error while listing the orders");
        res.json({success: false, message: "Error while listing the orders"})
    }
}

//updating order status
const updateStatus = async (req, res) => {
    try {
        const orderId = req.body.orderId
        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                status: req.body.status
            }
        )
        res.json({success: true, message: `Your Order is ${order.status}`})
    } catch (error) {
        console.log("Something went wrong while changing order status");
        res.json({success: false, message: "Something went wrong while changing order status"})
    }
}
export { placeOrder, placeOrderCod, verifyOrder, userOrders, listOrders, updateStatus }