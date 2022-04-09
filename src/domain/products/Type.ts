import mongoose from "mongoose";

const schema = new mongoose.Schema({
    description: { type: String, required: true },
    image: {type: String, required: true}
}, { timestamps: true });

export const TypeModel = mongoose.model("product_type", schema);

export interface Type {
    description: string;
    image: string;
}