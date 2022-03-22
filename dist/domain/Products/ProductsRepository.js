"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRepository = void 0;
const typeorm_1 = require("typeorm");
const Products_1 = require("./Products");
class ProductsRepository {
    constructor() {
        this.repository = (0, typeorm_1.getRepository)(Products_1.Products);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ProductsRepository();
        }
        return this.instance;
    }
    async count() {
        return await this.repository.count();
    }
    async findById(id) {
        return await this.repository.findOne({
            relations: ["productType"],
            where: { id: id }
        });
    }
    async findByName(name) {
        return await this.repository.findOne({
            relations: ["productType"],
            where: { name: name }
        });
    }
    async find(skip, limit) {
        return await this.repository.find({
            relations: ["productType"],
            skip: skip,
            take: limit,
            order: { name: "ASC" }
        });
    }
    async findByProductType(productTypeId, skip, limit) {
        return await this.repository.find({
            relations: ["productType"],
            skip: skip,
            take: limit,
            where: { product_type_id: productTypeId },
            order: { name: "ASC" }
        });
    }
    async create({ name, description, product_type_id, image }) {
        const product = await this.repository.create({
            name,
            description,
            product_type_id,
            image
        });
        await this.repository.save(product);
        return product;
    }
    async delete(id) {
        await this.repository.delete({ id });
    }
    async update(id, { name, description, product_type_id, image }) {
        const product = await this.findById(id);
        product.name = name ? name : product.name;
        product.description = description ? description : product.description;
        product.product_type_id = product_type_id ? product_type_id : product.product_type_id;
        product.image = image ? image : product.image;
        await this.repository.save(product);
        return product;
    }
}
exports.ProductsRepository = ProductsRepository;
//# sourceMappingURL=ProductsRepository.js.map