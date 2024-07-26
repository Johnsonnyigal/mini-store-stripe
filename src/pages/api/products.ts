import Product from "@/models/Product";
import connectDB from "@/utils/connectDB";
import { NextApiRequest, NextApiResponse } from "next";





export async function findAllProducts() {
    return await Product.find().exec()
}


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

        const {ids} = req.query;
        if(ids) {
            //@ts-ignore
            const idsArray = ids.split(",")
            
                res.json(
                    await Product.find({'_id': {$in:idsArray}})
                )

            
        }
        else {
            res.json(await findAllProducts());
        }

   
}