import {ResponseData} from "../../controller/ResponseData";
import {StatusCodes} from "http-status-codes";
import {ProductDTO} from "../../controller/Products/ProductDTO";
import {ProductsRepository} from "../../domain/Products/ProductsRepository";
import {ProductTypesRepository} from "../../domain/Products/ProductTypeRepository";

export class ProductsService {

    async count():(Promise<ResponseData>) {
        return new ResponseData(StatusCodes.OK, "", ProductsRepository.getInstance().count());
    }

    async list(skip:number, limit:number):(Promise<ResponseData>) {
        const list = await ProductsRepository.getInstance().find(skip, limit);
        return new ResponseData(StatusCodes.OK, "", ProductDTO.mapToListDTO(list));
    }

    async listByProductType(productTypeId: number, skip:number, limit:number):(Promise<ResponseData>) {
        const list = await ProductsRepository.getInstance().findByProductType(productTypeId, skip, limit);
        return new ResponseData(StatusCodes.OK, "", ProductDTO.mapToListDTO(list));
    }

    async get(id:number):(Promise<ResponseData>) {
        const product = await ProductsRepository.getInstance().findById(id);
        return new ResponseData(StatusCodes.OK, "", ProductDTO.mapToDTO(product));
    }

    async getByName(name: string):(Promise<ResponseData>) {
        const product = await ProductsRepository.getInstance().findByName(name);
        return new ResponseData(StatusCodes.OK, "", ProductDTO.mapToDTO(product));
    }

    async create({name, description, product_type_id, image}: ProductRequest):(Promise<ResponseData>) {
        if (await ProductsRepository.getInstance().findByName(name)) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "Produto já existe com o nome informado!");
        }

        if (!await ProductTypesRepository.getInstance().findById(product_type_id)) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Tipo de Produto informado não existe!");
        }

        const product = await ProductsRepository.getInstance()
                                .findById((await ProductsRepository.getInstance()
                                                        .create({name, description, product_type_id, image})).id);

        return new ResponseData(StatusCodes.CREATED, "", ProductDTO.mapToDTO(product));
    }

    async delete(id: number):(Promise<ResponseData>) {
        const product = await ProductsRepository.getInstance().findById(id);
        if (!product) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Produto com Id informado não existe!");
        }
        await ProductsRepository.getInstance().delete(id);
        return new ResponseData(StatusCodes.NO_CONTENT, "Produto removido com Sucesso!");
    }

    async update(id: number, {name, description, product_type_id, image}: ProductRequest):(Promise<ResponseData>) {
        const product = await ProductsRepository.getInstance().findById(id);
        if (!product) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Produto com Id informado não existe!");
        }
        if (await ProductsRepository.getInstance().findByName(name)) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "Produto já existe com o nome informado!");
        }

        if (!await ProductTypesRepository.getInstance().findById(product_type_id)) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Tipo de Produto informado não existe!");
        }

        return new ResponseData(StatusCodes.OK, "Produto atualizado com Sucesso!",
                            ProductDTO.mapToDTO(await ProductsRepository.getInstance()
                                                            .update(id, {name, description, product_type_id, image})));

    }
}

export interface ProductRequest {
    name: string;
    description: string;
    product_type_id: number;
    image: string;
}