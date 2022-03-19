import {getRepository} from "typeorm";
import {Products} from "./Products";
import {ProductRequest} from "../../service/Products/ProductsService";


export class ProductsRepository {

    static instance: ProductsRepository;

    repository = getRepository(Products);

    static getInstance(): ProductsRepository {
        if (!this.instance) {
            this.instance = new ProductsRepository();
        }
        return this.instance;
    }

    async count():  Promise<Number> {
        return await this.repository.count();
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

    async find(skip: number, limit: number): Promise<Products[]> {
        return await this.repository.find({
            relations:["productType"],
            skip: skip,
            take: limit,
            order: { name: "ASC" }});
    }

    async findByProductType(productTypeId: number, skip: number, limit: number) {
        return await this.repository.find({
            relations:["productType"],
            skip: skip,
            take: limit,
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