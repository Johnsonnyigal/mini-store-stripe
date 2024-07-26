import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import connectDB from "@/utils/connectDB";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Caching the database connection
let cachedDb: any = null;

async function handle(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST requests
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    // Connect to the database
    if (!cachedDb) {
        cachedDb = await connectDB();
    }

    try {
        const { email, name, address, city, products: productsIds } = req.body;

        // Validate request body
        if (!email || !name || !address || !city || !productsIds) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        const uniqIds = [...new Set(productsIds.split(","))];
        const products = await Product.find({ _id: { $in: uniqIds } }).exec();

        let line_items: any[] = [];

        // Create line items for Stripe
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

        // Create the order in the database
        const order = await Order.create({
            products: line_items,
            name,
            email,
            address,
            city,
            paid: 0,
        });

        // Create a Stripe session
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            customer_email: email,
            success_url: `${req.headers.origin}/?success=true`,
            cancel_url: `${req.headers.origin}/?canceled=true`,
            metadata: { orderId: order._id.toString() },
        });

        // Respond with the session URL
        res.status(303).json({ url: session.url });
    } catch (error) {
        console.error("Error in checkout handler:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Export the handler wrapped in a database connection function
const handler =  async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    return handle(req, res);
};

export default handler;
