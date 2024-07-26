import Product from "@/models/Product";
import connectDB from "@/utils/connectDB";
import { NextApiRequest, NextApiResponse } from "next";

// Function to find all products
export async function findAllProducts() {
    return await Product.find().exec();
}

// API handler function
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            await connectDB();

            const { ids } = req.query;

            if (ids) {
                // @ts-ignore
                const idsArray = ids.split(",");
                const products = await Product.find({ '_id': { $in: idsArray } });
                res.status(200).json(products);
            } else {
                const products = await findAllProducts();
                res.status(200).json(products);
            }
        } else {
            res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
