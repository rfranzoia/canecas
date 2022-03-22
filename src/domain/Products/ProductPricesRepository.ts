import {getRepository} from "typeorm";
import {ProductPrices} from "./ProductPrices";
import {ProductPriceRequest} from "../../service/Products/ProductPricesService";


export class ProductPricesRepository {

    static instance: ProductPricesRepository;

    repository = getRepository(ProductPrices);

    static getInstance(): ProductPricesRepository {
        if (!this.instance) {
            this.instance = new ProductPricesRepository();
        }
        return this.instance;
    }

    async count(pageSize: number):  Promise<{totalNumberOfRecords: number, pageSize: number, totalNumberOfPages: number}> {
        const count = await this.repository.count();
        return { totalNumberOfRecords: count,
                 pageSize: pageSize,
                 totalNumberOfPages: Math.floor(count / pageSize) + (count % pageSize == 0? 0: 1)}
    }

    async findById(id: number): Promise<ProductPrices> {
        return await this.repository.findOne({
            relations: ["product", "product.productType"],
            where: { id: id }});
    }

    async find(skip: number, limit: number): Promise<ProductPrices[]> {
        return await this.repository.find({
            relations:["product", "product.productType"],
            skip: skip,
            take: limit,
            order: { id: "ASC" }});
    }

    async findByProduct(productId: number, skip?: number, limit?: number): Promise<ProductPrices[]> {
        return await this.repository.find({
            relations:["product", "product.productType"],
            skip: skip,
            take: limit,
            where: { product_id: productId },
            order: { id: "ASC" }});
    }

    async findDistinctProductTypePrices(productTypeId: number, skip?: number, limit?: number): Promise<ProductPrices[]> {
        const condition = (productTypeId > 0)?"p.product_type_id = :id": "";
        return await this.repository.createQueryBuilder("pp")
                            .innerJoinAndSelect("pp.product", "p", condition, { id: productTypeId })
                            .innerJoinAndSelect("p.productType", "pt")
                            .orderBy({"pt.id": "ASC", "pp.price": "ASC"})
                            .take(limit)
                            .skip(skip)
                            .getMany();
    }

    async create({product_id, price, validUntil}: ProductPriceRequest): Promise<ProductPrices> {
        const product = await this.repository.create({
            product_id: Number(product_id),
            price: Number(price),
            validUntil: new Date(validUntil)
        });
        await this.repository.save(product);
        return product;
    }

    async delete(id: number) {
        await this.repository.delete({id});
    }

    async deleteByProduct(productId: number) {
        await this.repository.delete({
            product_id: productId
        });
    }

}