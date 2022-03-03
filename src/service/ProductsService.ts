import {ResponseData} from "../dto/ResponseData";
import {StatusCodes} from "http-status-codes";
import {ProductDTO} from "../dto/ProductDTO";
import {ProductRepository} from "../repository/ProductRepository";
import {ProductTypesRepository} from "../repository/ProductTypeRepository";

export type ProductRequest = {
    name: string;
    description: string;
    product_type_id: number;
    image: string;
}

export class ProductsService {

    async count(pageSize:number):(Promise<ResponseData>) {
        return new ResponseData(StatusCodes.OK, "", ProductRepository.getInstance().count(pageSize));
    }

    async list(pageNumber:number, pageSize:number):(Promise<ResponseData>) {
        const list = await ProductRepository.getInstance().find(pageNumber, pageSize);
        return new ResponseData(StatusCodes.OK, "", ProductDTO.mapToListDTO(list));
    }

    async listByProductType(productTypeId: number, pageNumber:number, pageSize:number):(Promise<ResponseData>) {
        const list = await ProductRepository.getInstance().findByProductType(productTypeId, pageNumber, pageSize);
        return new ResponseData(StatusCodes.OK, "", ProductDTO.mapToListDTO(list));
    }

    async get(id:number):(Promise<ResponseData>) {
        const product = await ProductRepository.getInstance().findById(id);
        return new ResponseData(StatusCodes.OK, "", ProductDTO.mapToDTO(product));
    }

    async create({name, description, product_type_id, image}: ProductRequest):(Promise<ResponseData>) {
        if (await ProductRepository.getInstance().findByName(name)) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "Produto já existe com o nome informado!");
        }

        if (!await ProductTypesRepository.getInstance().findById(product_type_id)) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Tipo de Produto informado não existe!");
        }

        const product = await ProductRepository.getInstance()
                                .findById((await ProductRepository.getInstance()
                                                        .create({name, description, product_type_id, image})).id);

        return new ResponseData(StatusCodes.CREATED, "", ProductDTO.mapToDTO(product));
    }

    async delete(id: number):(Promise<ResponseData>) {
        const product = await ProductRepository.getInstance().findById(id);
        if (!product) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Produto com Id informado não existe!");
        }
        await ProductRepository.getInstance().delete(id);
        return new ResponseData(StatusCodes.OK, "Produto removido com Sucesso!", ProductDTO.mapToDTO(product));
    }

    async update(id: number, {name, description, product_type_id, image}: ProductRequest):(Promise<ResponseData>) {
        const product = await ProductRepository.getInstance().findById(id);
        if (!product) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Produto com Id informado não existe!");
        }
        if (await ProductRepository.getInstance().findByName(name)) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "Produto já existe com o nome informado!");
        }

        if (!await ProductTypesRepository.getInstance().findById(product_type_id)) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Tipo de Produto informado não existe!");
        }

        return new ResponseData(StatusCodes.OK, "Produto atualizado com Sucesso!",
                            ProductDTO.mapToDTO(await ProductRepository.getInstance()
                                                            .update(id, {name, description, product_type_id, image})));

    }
}