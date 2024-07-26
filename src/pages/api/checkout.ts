import Order from "@/models/Orders";
import Product from "@/models/Product";
import connectDB from "@/utils/connectDB";
import { NextApiRequest, NextApiResponse } from "next";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDB();

        if (req.method !== "POST") {
            res.status(405).json({ error: "Method not allowed" });
            return;
        }

        const { email, name, address, city, products: productsIds } = req.body;

        if (!email || !name || !address || !city || !productsIds) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        
        const uniqIds = [...new Set(productsIds.split(","))];
        const products = await Product.find({ _id: { $in: uniqIds } }).exec();

        let line_items: any[] = [];

        for (let productId of uniqIds) {
            const quantity = productsIds.split(",").filter((id: string) => id === productId).length;
            const product = products.find((p) => p._id.toString() === productId);

            if (product) {
                line_items.push({
                    quantity,
                    price_data: {
                        currency: "USD",
                        product_data: { name: product.name },
                        unit_amount: product.price * 100,
                    }
                });
            }
        }

        const order = await Order.create({
            products: line_items,
            name,
            email,
            address,
            city,
            paid: 0,
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            customer_email: email,
            success_url: `${req.headers.origin}/?success=true`,
            cancel_url: `${req.headers.origin}/?canceled=true`,
            metadata: { orderId: order._id.toString() },
        });

        res.status(303).json({ url: session.url });
    } catch (error) {
        console.error("Error in checkout handler:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
