"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTypesRepository = void 0;
const typeorm_1 = require("typeorm");
const ProductTypes_1 = require("./ProductTypes");
const ProductPricesRepository_1 = require("./ProductPricesRepository");
class ProductTypesRepository {
    constructor() {
        this.repository = (0, typeorm_1.getRepository)(ProductTypes_1.ProductTypes);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ProductTypesRepository();
        }
        return this.instance;
    }
    async count() {
        return await this.repository.count();
    }
    async findById(id) {
        return await this.repository.findOne({
            where: { id: id }
        });
    }
    async findByDescription(description) {
        return await this.repository.findOne({
            where: { description: description }
        });
    }
    async findProductTypesWithMinPrices(skip, limit) {
        const prices = await ProductPricesRepository_1.ProductPricesRepository.getInstance().findDistinctProductTypePrices(0, skip, limit);
        const ss = new Set();
        const productTypesWithPrice = [];
        for (let i = 0; i < prices.length; i++) {
            if (!ss.has(prices[i].product.productType.id)) {
                ss.add(prices[i].product.productType.id);
                productTypesWithPrice.push({
                    id: prices[i].product.productType.id,
                    description: prices[i].product.productType.description,
                    price: prices[i].price,
                    image: prices[i].product.productType.image
                });
            }
        }
        return productTypesWithPrice;
    }
    async find(skip, limit) {
        return await this.repository.find({
            skip: skip,
            take: limit,
            order: { description: "ASC" }
        });
    }
    async create({ description, image }) {
        const product = await this.repository.create({
            description,
            image
        });
        await this.repository.save(product);
        return product;
    }
    async delete(id) {
        await this.repository.delete({ id });
    }
    async update(id, { description, image }) {
        const productType = await this.findById(id);
        productType.description = description ? description : productType.description;
        productType.image = image ? image : productType.image;
        await this.repository.save(productType);
        return productType;
    }
}
exports.ProductTypesRepository = ProductTypesRepository;
//# sourceMappingURL=ProductTypeRepository.js.map