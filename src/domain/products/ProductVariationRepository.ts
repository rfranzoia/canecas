import {DefaultRepository} from "../DefaultRepository";
import {ProductVariation, ProductVariationModel} from "./ProductVariation";
import logger from "../../utils/Logger";
import DatabaseError from "../../utils/errors/DatabaseError";

class ProductVariationRepository extends DefaultRepository<ProductVariation> {

    constructor() {
        super(ProductVariationModel);
    }

    async create(pv: ProductVariation) {
        try {
            const productVariation = await this.model.create({
                product: pv.product,
                drawings: pv.drawings,
                background: pv.background,
                price: pv.price,
                image: pv.image
            });
            await productVariation.save();
            return productVariation;
        } catch (error) {
            logger.error("Error creating Product Variation", error);
            return new DatabaseError(error);
        }
    }

    async update(id: string, pv: ProductVariation) {
        try {
            return await this.model.findOneAndUpdate({ _id: id }, {
                product: pv.product,
                drawings: pv.drawings,
                background: pv.background,
                price: pv.price,
                image: pv.image
            }, { returnOriginal: false  });
        } catch (error) {
            logger.error("Error updating Product Variation", error);
            return new DatabaseError(error);
        }

    }
}

export const productVariationRepository = new ProductVariationRepository();