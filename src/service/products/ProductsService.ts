import { Product } from "../../domain/products/Product";
import { productRepository } from "../../domain/products/ProductRepository";
import BadRequestError from "../../utils/errors/BadRequestError";
import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import NotFoundError from "../../utils/errors/NotFoundError";
import logger from "../../utils/Logger";
import { DefaultService } from "../DefaultService";

class ProductsService extends DefaultService<Product> {

    constructor() {
        super(productRepository, "Product");
    }

    async findByName(name: string) {
        if (!name) return;
        const product = await productRepository.findByName(name)
        if (!product) {
            return new NotFoundError(`No ${this.name} found with name ${name}`);
        }
        return product;
    }

    async create(product: Product) {
        try {
            const p = await productRepository.findByName(product.name);
            if (p) {
                return new BadRequestError("Product with same name already exists");
            }
            return await productRepository.create(product);
        } catch (error) {
            logger.error("Error while creating product", error.stack);
            return new InternalServerErrorError("Error while creating the product", error);
        }
    }

    async update(id: string, product: Product) {
        if (!id) {
            return new BadRequestError("Invalid ID")
        }
        const p = await productRepository.findById(id);
        if (!p) {
            return new NotFoundError(`No product found with ID ${id}`);
        }
        const p2 = await productRepository.findByName(product.name);
        if (p2 && p2.id !== id) {
            return new BadRequestError("Product already exists");
        }
        return await productRepository.update(id, product);
    }
}

export const productService = new ProductsService();