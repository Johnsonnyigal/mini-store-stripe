import mongoose, { Schema } from "mongoose";



const orderSchema = new Schema({
    products: Object,
    name: String,
    email: String,
    address: String,
    city: String,
    paid: {type: Number, defaultValue: 0}

}, {timestamps: true})

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);


export default Order;