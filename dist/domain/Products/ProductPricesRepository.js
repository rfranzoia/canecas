"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPricesRepository = void 0;
const typeorm_1 = require("typeorm");
const ProductPrices_1 = require("./ProductPrices");
class ProductPricesRepository {
    constructor() {
        this.repository = (0, typeorm_1.getRepository)(ProductPrices_1.ProductPrices);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ProductPricesRepository();
        }
        return this.instance;
    }
    async count(pageSize) {
        const count = await this.repository.count();
        return { totalNumberOfRecords: count,
            pageSize: pageSize,
            totalNumberOfPages: Math.floor(count / pageSize) + (count % pageSize == 0 ? 0 : 1) };
    }
    async findById(id) {
        return await this.repository.findOne({
            relations: ["product", "product.productType"],
            where: { id: id }
        });
    }
    async find(skip, limit) {
        return await this.repository.find({
            relations: ["product", "product.productType"],
            skip: skip,
            take: limit,
            order: { id: "ASC" }
        });
    }
    async findByProduct(productId, skip, limit) {
        return await this.repository.find({
            relations: ["product", "product.productType"],
            skip: skip,
            take: limit,
            where: { product_id: productId },
            order: { id: "ASC" }
        });
    }
    async findDistinctProductTypePrices(productTypeId, skip, limit) {
        const condition = (productTypeId > 0) ? "p.product_type_id = :id" : "";
        return await this.repository.createQueryBuilder("pp")
            .innerJoinAndSelect("pp.product", "p", condition, { id: productTypeId })
            .innerJoinAndSelect("p.productType", "pt")
            .orderBy({ "pt.id": "ASC", "pp.price": "ASC" })
            .take(limit)
            .skip(skip)
            .getMany();
    }
    async create({ product_id, price, validFrom, validTo }) {
        const product = await this.repository.create({
            product_id: Number(product_id),
            price: Number(price),
            validFrom: new Date(validFrom),
            validTo: new Date(validTo)
        });
        await this.repository.save(product);
        return product;
    }
    async delete(id) {
        await this.repository.delete({ id });
    }
    async deleteByProduct(productId) {
        await this.repository.delete({
            product_id: productId
        });
    }
}
exports.ProductPricesRepository = ProductPricesRepository;
//# sourceMappingURL=ProductPricesRepository.js.map