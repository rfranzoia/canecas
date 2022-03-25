import {ProductDTO} from "../../controller/Products/ProductDTO";
import {ProductsRepository} from "../../domain/Products/ProductsRepository";
import {ProductTypesRepository} from "../../domain/Products/ProductTypeRepository";
import BadRequestError from "../../utils/errors/BadRequestError";
import NotFoundError from "../../utils/errors/NotFoundError";
import InternalServerError from "../../utils/errors/InternalServerError";
import logger from "../../utils/Logger";

export class ProductsService {

    async count(): Promise<Number> {
        return ProductsRepository.getInstance().count();
    }

    async list(skip:number, limit:number): Promise<ProductDTO[]> {
        const list = await ProductsRepository.getInstance().find(skip, limit);
        return ProductDTO.mapToListDTO(list);
    }

    async listByProductType(productTypeId: number, skip:number, limit:number): Promise<ProductDTO[]> {
        const list = await ProductsRepository.getInstance().findByProductType(productTypeId, skip, limit);
        return ProductDTO.mapToListDTO(list);
    }

    async listByPriceRange(startPrice: number, endPrice: number, skip: number, limit: number): Promise<ProductDTO[] | BadRequestError> {
        startPrice = startPrice || 0;
        endPrice = endPrice || 0;

        if (startPrice < 0 || endPrice < 0) {
            return new BadRequestError("Os preços de inicio e fim devem ser maiores que zero")
        }

        const list = await ProductsRepository.getInstance().findByPriceRange(startPrice, endPrice, skip, limit);
        return ProductDTO.mapToListDTO(list);
    }

    async get(id:number): Promise<ProductDTO | NotFoundError> {
        const product = await ProductsRepository.getInstance().findById(id);
        if (!product) {
            return new NotFoundError(`Produto com id ${id} não existe`)
        }
        return ProductDTO.mapToDTO(product);
    }

    async getByName(name: string): Promise<ProductDTO | NotFoundError> {
        const product = await ProductsRepository.getInstance().findByName(name);
        if (!product) {
            return new NotFoundError(`Produto com nome ${name} não existe`)
        }
        return ProductDTO.mapToDTO(product);
    }

    async create({name, description, product_type_id, image, price}: ProductRequest): Promise<ProductDTO | BadRequestError | NotFoundError | InternalServerError> {

        if (await ProductsRepository.getInstance().findByName(name)) {
            return new BadRequestError("Produto já existe com o nome informado!");

        } else if (!await ProductTypesRepository.getInstance().findById(product_type_id)) {
            return new NotFoundError("Tipo de Produto informado não existe!");
        }

        try {
            const product = await ProductsRepository.getInstance()
                    .findById((await ProductsRepository.getInstance()
                        .create({name, description, product_type_id, image, price})).id);

            return ProductDTO.mapToDTO(product);
        } catch (error) {
            logger.error("Erro ao criar o produto");
            return new InternalServerError("Ocorreu um problema ao criar o produto");
        }

    }

    async delete(id: number): Promise<void | NotFoundError> {
        const product = await ProductsRepository.getInstance().findById(id);
        if (!product) {
            return new NotFoundError(`Produto com id ${id} não existe`)
        }
        await ProductsRepository.getInstance().delete(id);
    }

    async update(id: number, {name, description, product_type_id, image, price}: ProductRequest): Promise<ProductDTO | NotFoundError | BadRequestError | InternalServerError> {
        const product = await ProductsRepository.getInstance().findById(id);
        if (!product) {
            return new NotFoundError(`Produto com id ${id} não existe`);

        } else if (await ProductsRepository.getInstance().findByName(name)) {
            return new BadRequestError("Produto já existe com o nome informado!");

        } else if (!await ProductTypesRepository.getInstance().findById(product_type_id)) {
            return new NotFoundError("Tipo de Produto informado não existe!");
        }

        try {
            return ProductDTO.mapToDTO(await ProductsRepository.getInstance().update(id, {name, description, product_type_id, image, price}));
        } catch (error) {
            logger.error("Erro ao atualizar o produto");
            return new InternalServerError("Ocorreu um problema ao atualizar o produto");
        }

    }
}

export interface ProductRequest {
    name: string;
    description: string;
    product_type_id: number;
    image: string;
    price: number;
}
