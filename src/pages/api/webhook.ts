import Order from "@/models/Orders";
import connectDB from "@/utils/connectDB"
import { NextApiResponse, NextApiRequest } from "next";
const stripe = require("stripe")(process.env.STRIPE_SECRET);
import { buffer } from "micro";
//localhost:3000/api/webhook



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    const signingSecret = process.env.SIGNING_SECRET;
    const payload = await buffer(req);
    const signature = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(payload, signature, signingSecret);

    if(event?.type === "checkout.session.completed") {
        const metadata = event.data.object.metadata;
        const paymentStatus = event.data?.object?.payment_status;

        if(metadata?.orderId && paymentStatus === "paid"){
             await Order.findByIdAndUpdate(metadata.orderId, {paid: 1});

        }
    }
    res.json("ok");

}


export const config = {
    api:{
        bodyParser: false
    }
}