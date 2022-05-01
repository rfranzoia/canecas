import mongoose from "mongoose";
import { DefaultModel } from "../repository/DefaultRepository";

export enum BackgroundType { EMPTY = "empty", PERSONALIZED = "personalized" }

export interface ProductVariation extends DefaultModel {
    product?: string,
    caricatures?: number,
    background?: BackgroundType,
    price?: number,
    image?: string
}

const schema = new mongoose.Schema<ProductVariation>({
    product: { type: String, required: true },
    caricatures: { type: Number, required: true },
    background: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
}, { timestamps: true });

export const ProductVariationModel = mongoose.model("product_variation", schema);

