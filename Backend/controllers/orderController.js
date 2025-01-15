import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// globalvariable 
const currency = 'inr'
const deliveryCharges = 10;

// Placing order using COD Metod
export const placeOrder = async(req, res) => {
    try {
        const {userId, amount, items, address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'cod',
            payment: false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, {cartData: {}});

        res.json({success: true, message: 'Order has been Placed!'})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Placing order using esewa Metod
export const placeOrderStripe = async(req, res) => {
    try {
        const {userId, amount, items, address} = req.body;
        const {origin} = req.headers;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item)=> ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery fee',
                },
                unit_amount: deliveryCharges * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })
        res.json({success: true, session_url: session.url})
} catch (error) {
    console.log(error);
    res.json({success: false, message: error.message})
    }
}  

// verfiy Stripe
export const verfiyStripe = async(req, res, )=>{
     const {orderId, success, userId} = req.body;
     console.log(orderId, success, userId);
     try {
        if(success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment: true})
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true})
            console.log(orderId, success, userId);
        } else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success: false})
        }
     } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
     }
}


// All Orders data for Admin Panel

export const allOrders = async(req, res) => {
    try {
        const orders = await orderModel.find({})

        res.json({success: true, orders})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// User Orders data for frontend

export const userOrders = async(req, res) => {
    try {
        const {userId} = req.body;

        const orders = await orderModel.find({userId});

        res.json({success: true, orders})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Update order status from admin panel

export const updateStatus = async(req, res) => {
    try {
        const {orderId, status} = req.body;
        
        await orderModel.findByIdAndUpdate(orderId, {status})

        res.json({success: true, message: 'Status Updated!'})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}
