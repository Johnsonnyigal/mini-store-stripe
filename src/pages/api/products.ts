import Product from "@/models/Product";
import connectDB from "@/utils/connectDB";
import { NextApiRequest, NextApiResponse } from "next";

// Caching the database connection
let cachedDb: any = null;

// Function to find all products
export async function findAllProducts() {
    return await Product.find().exec();
}

// API handler function
async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            // Connect to the database
            if (!cachedDb) {
                cachedDb = await connectDB();
            }

            const { ids } = req.query;

            if (ids) {
                const idsArray = (ids as string).split(",");
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

// Export the handler wrapped in a database connection function
const handler =  async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    return handle(req, res);
};

export default handler;