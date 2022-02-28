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

    async create({name, description, product_type_id, image}: ProductRequest):(Promise<ResponseData>) {
        const repository = getRepository(Products);
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

    async count(pageSize:number) {
        const count = await getRepository(Products).count();
        return new ResponseData(StatusCodes.OK, "", { totalNumberOfRecords: count,
            pageSize: pageSize,
            totalNumberOfPages: Math.floor(count / pageSize) + (count % pageSize == 0? 0: 1)});
    }

    async list(pageNumber:number, pageSize:number) {
        const list = await  getRepository(Products).find({
            relations:["productType"],
            skip: pageNumber * pageSize,
            take: pageSize,
            order: {
                name: "ASC"
            }
        });

        return new ResponseData(StatusCodes.OK, "", list);
    }
}