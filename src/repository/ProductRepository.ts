import {getRepository} from "typeorm";
import {Products} from "../entity/Products";
import {ProductRequest} from "../service/ProductsService";


export class ProductRepository {

    static instance: ProductRepository;

    repository = getRepository(Products);

    static getInstance(): ProductRepository {
        if (!this.instance) {
            this.instance = new ProductRepository();
        }
        return this.instance;
    }

    async count(pageSize: number):  Promise<{totalNumberOfRecords: number, pageSize: number, totalNumberOfPages: number}> {
        const count = await this.repository.count();
        return { totalNumberOfRecords: count,
                 pageSize: pageSize,
                 totalNumberOfPages: Math.floor(count / pageSize) + (count % pageSize == 0? 0: 1)}
    }

    async findById(id: number): Promise<Products> {
        return await this.repository.findOne({
            relations: ["productType"],
            where: { id: id }});
    }

    async findByName(name: string): Promise<Products> {
        return await this.repository.findOne({
            relations: ["productType"],
            where: { name: name }});
    }

    async find(pageNumber: number, pageSize: number): Promise<Products[]> {
        return await this.repository.find({
            relations:["productType"],
            skip: pageNumber * pageSize,
            take: pageSize,
            order: { name: "ASC" }});
    }

    async findByProductType(productTypeId: number, pageNumber: number, pageSize: number) {
        return await this.repository.find({
            relations:["productType"],
            skip: pageNumber * pageSize,
            take: pageSize,
            where: { product_type_id: productTypeId },
            order: { name: "ASC" }});
    }

    async create({name, description, product_type_id, image}: ProductRequest): Promise<Products> {
        const product = await this.repository.create({
            name,
            description,
            product_type_id,
            image
        });
        await this.repository.save(product);
        return product;
    }

    async delete(id: number) {
        await this.repository.delete({id});
    }

    async update(id: number, {name, description, product_type_id, image}: ProductRequest): Promise<Products> {
        const product = await this.findById(id);

        product.name = name? name: product.name;
        product.description = description? description: product.description;
        product.product_type_id = product_type_id? product_type_id: product.product_type_id;
        product.image = image? image: product.image;

        await this.repository.save(product);
        return product;
    }
}