import mongoose from "mongoose";
import { DefaultModel } from "../repository/DefaultRepository";

export interface Product extends DefaultModel {
    name?: string;
    description?: string;
    price?: number;
    image?: string
}

const schema = new mongoose.Schema<Product>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
}, { timestamps: true });

export const ProductModel = mongoose.model("product", schema);

