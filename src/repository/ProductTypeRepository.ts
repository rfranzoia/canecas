import {getRepository} from "typeorm";
import {ProductTypes} from "../entity/ProductTypes";
import {ProductTypeRequest} from "../service/ProductTypesService";
import {ProductPricesRepository} from "./ProductPricesRepository";

export type ProductTypeWithPrice = {
    id: number;
    description: string;
    image: string;
    price: number;
}

export class ProductTypesRepository {
    
    static instance: ProductTypesRepository;
    repository = getRepository(ProductTypes);
    
    static getInstance(): ProductTypesRepository {
        if (!this.instance) {
            this.instance = new ProductTypesRepository();
        }
        return this.instance;
    }

    async count(pageSize: number):  Promise<{totalNumberOfRecords: number, pageSize: number, totalNumberOfPages: number}> {
        const count = await this.repository.count();
        return { totalNumberOfRecords: count,
            pageSize: pageSize,
            totalNumberOfPages: Math.floor(count / pageSize) + (count % pageSize == 0? 0: 1)}
    }

    async findById(id: number): Promise<ProductTypes> {
        return await this.repository.findOne({
            where: { id: id }});
    }

    async findByDescription(description: string): Promise<ProductTypes> {
        return await this.repository.findOne({
            where: { description: description }});
    }

    async findProductTypesWithMinPrices(pageNumber:number, pageSize:number): Promise<ProductTypeWithPrice[]> {
        const prices = await ProductPricesRepository.getInstance().findDistinctProductTypePrices(0, pageNumber, pageSize);
        const ss = new Set<Number>();
        const productTypesWithPrice = [];
        for (let i = 0; i < prices.length; i++) {
            if (!ss.has(prices[i].product.productType.id)) {
                ss.add(prices[i].product.productType.id);
                productTypesWithPrice.push({
                    id: prices[i].product.productType.id,
                    description: prices[i].product.productType.description,
                    price: prices[i].price,
                    image: prices[i].product.productType.image
                })
            }
        }
        return productTypesWithPrice;
    }

    async find(pageNumber: number, pageSize: number): Promise<ProductTypes[]> {
        return await this.repository.find({
            skip: pageNumber * pageSize,
            take: pageSize,
            order: { description: "ASC" }});
    }

    async create({description, image}: ProductTypeRequest): Promise<ProductTypes> {
        const product = await this.repository.create({
            description,
            image
        });
        await this.repository.save(product);
        return product;
    }

    async delete(id: number) {
        await this.repository.delete({id});
    }

    async update(id: number, {description, image}: ProductTypeRequest): Promise<ProductTypes> {
        const productType = await this.findById(id);

        productType.description = description? description: productType.description;
        productType.image = image? image: productType.image;

        await this.repository.save(productType);
        return productType;
    }
}