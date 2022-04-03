import mongoose from "mongoose";

const schema = new mongoose.Schema({
    description: { type: String, required: true },
    image: {type: String, required: true}
}, { timestamps: true });

export const ProductTypeModel = mongoose.model("product_type", schema);

export interface ProductType {
    description: string;
    image: string;
}