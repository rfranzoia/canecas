import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    image: {type: String, required: true}
}, { timestamps: true });

export const ProductModel = mongoose.model("product", schema);

export interface Product {
    name?: string;
    description?: string;
    price?: number;
    type?: string;
    image?: string
}