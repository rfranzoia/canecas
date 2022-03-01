import {ProductTypes} from "../entity/ProductTypes";
import {getRepository} from "typeorm";
import {ResponseData} from "../controller/ResponseData";
import {StatusCodes} from "http-status-codes";

export class ProductTypesService {

    repository = getRepository(ProductTypes);

    async count(pageSize:number) {
        const count = await this.repository.count();
        return new ResponseData(StatusCodes.OK, "", { totalNumberOfRecords: count,
            pageSize: pageSize,
            totalNumberOfPages: Math.floor(count / pageSize) + (count % pageSize == 0? 0: 1)});
    }

    async list(pageNumber:number, pageSize:number) {
        const list = await this.repository
            .createQueryBuilder("pt")
            .orderBy("pt.description")
            .skip(pageNumber * pageSize)
            .take(pageSize)
            .getMany();

        return new ResponseData(StatusCodes.OK, "", list);
    }

    async get(id: number):(Promise<ResponseData>) {
        const repository = this.repository;
        const productType = await repository.findOne(id);

        if (!productType) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Tipo de Produto não existe!");
        }

        return new ResponseData(StatusCodes.OK, "", productType);
    }

    async create(description:string):(Promise<ResponseData>){
        const repository = this.repository;

        if (await repository.findOne({description})) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "Tipo de Produto já existe!");
        }

        const productType = repository.create({
            description
        });

        await repository.save(productType);

        return new ResponseData(StatusCodes.CREATED, "", productType);
    }

    async delete(id: number):(Promise<ResponseData>) {
        const repository = this.repository;
        const productType = await repository.findOne(id);

        if (!productType) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Tipo de Produto não existe!");
        }

        await repository.delete({id});

        return new ResponseData(StatusCodes.OK, "Tipo de Produto removido com Sucesso!", productType);
    }

    async update(id: number, description: string):(Promise<ResponseData>) {
        const repository = this.repository;
        const productType = await repository.findOne(id);

        if (!productType) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Tipo de Produto não existe!");
        }

        if (await repository.findOne({description})) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "Já existe um Tipo de Produto com a descrição informada!");
        }

        productType.description = description ? description : productType.description;
        await repository.save(productType)

        return new ResponseData(StatusCodes.OK, "Tipo de Produto atualizado com Sucesso!", productType);
    }

}