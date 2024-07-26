import Order from "@/models/Orders";
import Product from "@/models/Product";
import connectDB from "@/utils/connectDB";
import { NextApiRequest, NextApiResponse } from "next";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    await connectDB();

    if(req.method !== "POST") {
        res.json("should be a post but its not!")
        return
    }
  
    const {email, name, address, city} = req.body;
    const productsIds = req.body.products.split(",");
    //@ts-ignore
    const uniqIds = [...new Set(productsIds)];
    //@ts-ignore
    const products = await Product.find({_id: {$in:uniqIds}}).exec();
    let line_items: any[] = [];
    
    for (let productId of uniqIds) {
        //@ts-ignore
        const quantity = productsIds.filter(id => id === productId).length;
        const product = products.find(p => p._id.toString() === productId)!;
        
        line_items.push({
            quantity,
            price_data: {
                currency: "USD",
                product_data: {name: product.name},
                unit_amount: product.price * 100,
            }
        })
    }
    
    const order = await Order.create({
        products: line_items,
        name,
        email,
        address,
        city,
        paid: 0,
    })

    const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: "payment",
        customer_email: email,
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        metadata: {orderId:order._id.toString()},
    })


    res.redirect(303, session.url);
}