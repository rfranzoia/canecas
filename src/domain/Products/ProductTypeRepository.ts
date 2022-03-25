import {getRepository} from "typeorm";
import {ProductTypes} from "./ProductTypes";
import {ProductTypeRequest} from "../../service/Products/ProductTypesService";

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

    async count():  Promise<number> {
        return await this.repository.count();
    }

    async findById(id: number): Promise<ProductTypes> {
        return await this.repository.findOne({
            where: { id: id }});
    }

    async findByDescription(description: string): Promise<ProductTypes> {
        return await this.repository.findOne({
            where: { description: description }});
    }

    async find(skip: number, limit: number): Promise<ProductTypes[]> {
        return await this.repository.find({
            skip: skip,
            take: limit,
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