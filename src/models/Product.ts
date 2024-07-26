
import mongoose, { Model } from "mongoose";

export interface IProduct {
    _id?: string,
    name: string,
    description: string,
    price: number,
    category: string,
    picture: string
}

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    picture: String
})

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model("Product", productSchema);


export default Product;