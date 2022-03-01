import {getRepository} from "typeorm";
import {ResponseData} from "../controller/ResponseData";
import {StatusCodes} from "http-status-codes";
import {Products} from "../entity/Products";
import {ProductTypes} from "../entity/ProductTypes";

type ProductRequest = {
    name: string;
    description: string;
    product_type_id: number;
    image: string;
}

export class ProductsService {

    repository = getRepository(Products);
    
    async count(pageSize:number):(Promise<ResponseData>) {
        const count = await this.repository.count();
        return new ResponseData(StatusCodes.OK, "", { totalNumberOfRecords: count,
            pageSize: pageSize,
            totalNumberOfPages: Math.floor(count / pageSize) + (count % pageSize == 0? 0: 1)});
    }

    async list(pageNumber:number, pageSize:number):(Promise<ResponseData>) {
        const list = await  this.repository.find({
            relations:["productType"],
            skip: pageNumber * pageSize,
            take: pageSize,
            order: {
                name: "ASC"
            }
        });

        return new ResponseData(StatusCodes.OK, "", list);
    }

    async create({name, description, product_type_id, image}: ProductRequest):(Promise<ResponseData>) {
        const repository = this.repository;
        const productTypeRepository = getRepository(ProductTypes);

        if (await repository.findOne({name})) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "Produto já existe!");
        }

        if (!await productTypeRepository.findOne(product_type_id)) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Tipo de Produto não existe!");
        }

        const product = await repository.create({
            name,
            description,
            product_type_id,
            image
        });
        await repository.save(product);

        return new ResponseData(StatusCodes.CREATED, "", product);
    }

    async get(id:number):(Promise<ResponseData>) {
        const product = await  this.repository
            .findOne({
                relations:["productType"],
                where: {id: id}
        });
        return new ResponseData(StatusCodes.OK, "", product);
    }

    async delete(id: number):(Promise<ResponseData>) {
        const product = await this.repository.findOne(id);
        if (!product) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Produto com Id informado não existe!");
        }
        await this.repository.delete({id});
        return new ResponseData(StatusCodes.OK, "Produto removido com Sucesso!", product);
    }

    async update(id: number, {name, description, product_type_id, image}: ProductRequest):(Promise<ResponseData>) {
        const product = await this.repository.findOne(id);
        if (!product) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Produto com Id informado não existe!");
        }
        if (await this.repository.findOne({name})) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "Já existe um produto com o nome informado!!");
        }

        product.name = name? name: product.name;
        product.description = description? description: product.description;
        product.product_type_id = product_type_id? product_type_id: product.product_type_id;
        product.image = image? image: product.image;

        await this.repository.save(product);

        return new ResponseData(StatusCodes.OK, "Produto atualizado com Sucesso!", product);

    }
}