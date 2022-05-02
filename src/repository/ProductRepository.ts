import { Product, ProductModel } from "../domain/Product";
import { DefaultRepository } from "./DefaultRepository";

class ProductRepository extends DefaultRepository<Product> {

    constructor() {
        super(ProductModel);
    }

    async findByName(name: string) {
        return await this.model.findOne({ name: name }, { '__v': 0, });
    }

}

export const productRepository = new ProductRepository();