import {ProductTypeDTO} from "../../controller/Products/ProductTypeDTO";
import {ProductTypesRepository} from "../../domain/Products/ProductTypeRepository";
import NotFoundError from "../../utils/errors/NotFoundError";
import BadRequestError from "../../utils/errors/BadRequestError";
import logger from "../../utils/Logger";
import InternalServerError from "../../utils/errors/InternalServerError";

export class ProductTypesService {

    async count(): Promise<number> {
        return await ProductTypesRepository.getInstance().count();
    }

    async list(skip:number, limit:number): Promise<ProductTypeDTO[]> {
        const list = await ProductTypesRepository.getInstance().find(skip, limit);
        return ProductTypeDTO.mapToListDTO(list);
    }

    async get(id: number): Promise<ProductTypeDTO | NotFoundError> {
        const productType = await ProductTypesRepository.getInstance().findById(id);
        if (!productType) {
            return new NotFoundError(`Tipo de Produto com ID ${id} não existe`)
        }
        return ProductTypeDTO.mapToDTO(productType);
    }

    async getByDescription(description: string): Promise<ProductTypeDTO | NotFoundError> {
        const productType = await ProductTypesRepository.getInstance().findByDescription(description);
        if (!productType) {
            return new NotFoundError(`Tipo de Produto com descrição ${description} não existe`)
        }
        return ProductTypeDTO.mapToDTO(productType);
    }

    async create({description, image}: ProductTypeRequest): Promise<ProductTypeDTO | BadRequestError | InternalServerError> {
        if (await ProductTypesRepository.getInstance().findByDescription(description)) {
            return new BadRequestError(`Tipo de produto com descrição ${description} já existe`);
        }

        try {
            const productType = await ProductTypesRepository.getInstance().findById((await ProductTypesRepository.getInstance().create({description, image})).id);
            return ProductTypeDTO.mapToDTO(productType);
        } catch (error) {
            logger.error("Error creating the product type", error);
            return new InternalServerError("Ocorreu um erro ao criar o Tipo de Produto")
        }
    }

    async delete(id: number): Promise<void | NotFoundError> {
        const productType = await ProductTypesRepository.getInstance().findById(id);
        if (!productType) {
            return new NotFoundError(`Tipo de Produto com ID ${id} não existe`) ;
        }

        await ProductTypesRepository.getInstance().delete(productType.id);
    }

    async update(id: number, {description, image}: ProductTypeRequest): Promise<ProductTypeDTO | NotFoundError | BadRequestError | InternalServerError> {
        let productType = await ProductTypesRepository.getInstance().findById(id);
        if (!productType) {
            return new NotFoundError(`Tipo de Produto com ID ${id} não existe`);
        }

        if (await ProductTypesRepository.getInstance().findByDescription(description)) {
            return new BadRequestError(`Tipo de Produto com descrição "${id}" já existe`) ;
        }

        try {
            productType = await ProductTypesRepository.getInstance().update(id, {description, image});
            return ProductTypeDTO.mapToDTO(productType);
        } catch (error) {
            logger.error("An error occur while updating the product type", error);
            return new InternalServerError(`Ocorreu um erro ao atualizar o produto`);
        }
    }
}


export interface ProductTypeRequest {
    description: string;
    image: string;
}
