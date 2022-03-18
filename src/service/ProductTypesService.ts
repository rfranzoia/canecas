import {ResponseData} from "../dto/ResponseData";
import {StatusCodes} from "http-status-codes";
import {ProductTypeDTO} from "../dto/ProductTypeDTO";
import {ProductTypesRepository} from "../repository/ProductTypeRepository";

export type ProductTypeRequest = {
    description: string;
    image: string;
}

export class ProductTypesService {

    async count() {
        return new ResponseData(StatusCodes.OK, "", await ProductTypesRepository.getInstance().count());
    }

    async list(skip:number, limit:number) {
        const list = await ProductTypesRepository.getInstance().find(skip, limit);
        return new ResponseData(StatusCodes.OK, "", ProductTypeDTO.mapToListDTO(list));
    }

    async listProductTypesWithMinPricesAvailable(skip:number, limit:number): Promise<ResponseData> {
        return new ResponseData(StatusCodes.OK, "", await ProductTypesRepository.getInstance().findProductTypesWithMinPrices(skip, limit));
    }

    async get(id: number):(Promise<ResponseData>) {
        const productType = await ProductTypesRepository.getInstance().findById(id);
        if (!productType) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Tipo de Produto não existe!");
        }
        return new ResponseData(StatusCodes.OK, "", ProductTypeDTO.mapToDTO(productType));
    }

    async create({description, image}: ProductTypeRequest):(Promise<ResponseData>){
        if (await ProductTypesRepository.getInstance().findByDescription(description)) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "Tipo de Produto já existe!");
        }

        const productType = await ProductTypesRepository.getInstance().findById((await ProductTypesRepository.getInstance().create({description, image})).id);
        return new ResponseData(StatusCodes.CREATED, "", ProductTypeDTO.mapToDTO(productType));
    }

    async delete(id: number):(Promise<ResponseData>) {
        const productType = await ProductTypesRepository.getInstance().findById(id);
        if (!productType) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Tipo de Produto não existe!");
        }

        await ProductTypesRepository.getInstance().delete(productType.id);
        return new ResponseData(StatusCodes.OK, "Tipo de Produto removido com Sucesso!", ProductTypeDTO.mapToDTO(productType));
    }

    async update(id: number, {description, image}: ProductTypeRequest):(Promise<ResponseData>) {
        let productType = await ProductTypesRepository.getInstance().findById(id);
        if (!productType) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Tipo de Produto não existe!");
        }

        if (await ProductTypesRepository.getInstance().findByDescription(description)) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "Tipo de Produto já existe!");
        }

        productType = await ProductTypesRepository.getInstance().update(id, {description, image});
        return new ResponseData(StatusCodes.OK, "Tipo de Produto atualizado com Sucesso!", ProductTypeDTO.mapToDTO(productType));
    }

}