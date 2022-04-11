import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import {Product, ProductModel} from "./Product";
import logger from "../../utils/Logger";

class ProductRepository {

    async count() {
        return await ProductModel.count();
    }

    async findAll() {
        return await ProductModel.find({}, {
            '__v': 0,
        });
    }

    async findAllOrderByType() {
        return await ProductModel.find({}, {
            '__v': 0,
        }).sort({ type: "asc", name: "asc" });
    }


    async findByType(type: string) {
        return await ProductModel.find({ type: type }, {
            '__v': 0,
        });
    }

    async findByPriceRange(startPrice: number, endPrice: number) {
        return await ProductModel.find({
            price: {
                $gte: startPrice,
                $lte: endPrice
            }
        }, {
            '__v': 0,
        });
    }

    async findById(id: string) {
        return await ProductModel.findOne({ _id: id }, { '__v': 0,});
    }

    async findByName(name: string) {
        return await ProductModel.findOne({ name: name }, { '__v': 0,});
    }

    async create(product: Product) {
        try {
            const p = await ProductModel.create({
                name: product.name,
                description: product.description,
                price: product.price,
                type: product.type,
                image: product.image
            });
            await p.save();
            return p;
        } catch (error) {
            logger.error("Error creating Product", error);
            return new InternalServerErrorError(error);
        }
    }

    async delete(id: string) {
        try {
            await ProductModel.deleteOne({ _id: id });
        } catch (error) {
            logger.error("Error deleting password", error);
            return new InternalServerErrorError(error);
        }
    }

    async update(id: string, product: Product) {
        try {
            return await ProductModel.findOneAndUpdate({ _id: id }, {
                name: product.name,
                description: product.description,
                price: product.price,
                type: product.type,
                image: product.image
            }, { returnOriginal: false  });
        } catch (error) {
            logger.error("Error updating Product", error);
            return new InternalServerErrorError(error);
        }

    }
}

export const productRepository = new ProductRepository();