import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import logger from "../../utils/Logger";
import { DefaultRepository } from "../DefaultRepository";
import { Product, ProductModel } from "./Product";

class ProductRepository extends DefaultRepository<Product> {

    constructor() {
        super(ProductModel);
    }

    async findByName(name: string) {
        return await this.model.findOne({ name: name }, { '__v': 0, });
    }

    async create(product: Product) {
        try {
            const p = await ProductModel.create({
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image
            });
            await p.save();
            return p;
        } catch (error) {
            logger.error("Error creating Product", error);
            return new InternalServerErrorError(error);
        }
    }

    async update(id: string, product: Product) {
        try {
            return await ProductModel.findOneAndUpdate({ _id: id }, {
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image
            }, { returnOriginal: false });
        } catch (error) {
            logger.error("Error updating Product", error);
            return new InternalServerErrorError(error);
        }

    }
}

export const productRepository = new ProductRepository();