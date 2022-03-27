import {ProductType} from "../../domain/products/ProductType";
import BadRequestError from "../../utils/errors/BadRequestError";
import NotFoundError from "../../utils/errors/NotFoundError";
import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import {productTypeRepository} from "../../domain/products/ProductTypeRepository";

class ProductTypesService {

    async count() {
        return await productTypeRepository.count();
    }

    async list() {
        return await productTypeRepository.findAll();
    }

    async findById(id: string) {
        const pt = await productTypeRepository.findById(id);
        if (!pt) {
            return new NotFoundError(`No type found with ID ${id}`);
        }
        return pt;
    }

    async findByDescription(description: string) {
        const pt = await productTypeRepository.findByDescription(description)
        if (!pt) {
            return new NotFoundError(`No type found with description ${description}`);
        }
        return pt;
    }

    async create(productType: ProductType) {
        const pt = await productTypeRepository.findByDescription(productType.description);
        if (pt) {
            return new BadRequestError("Type already exists");
        }
        return await productTypeRepository.create(productType);
    }

    async delete(id: string) {
        const pt = await productTypeRepository.findById(id);
        if (!pt) {
            return new NotFoundError(`No type found with ID ${id}`);
        }
        const result = await productTypeRepository.delete(id);
        if (result instanceof InternalServerErrorError) {
            return result;
        }
    }

    async update(id: string, description: string) {
        const pt = await productTypeRepository.findById(id);
        if (!pt) {
            return new NotFoundError(`No type found with ID ${id}`);
        }
        const pt2 = await productTypeRepository.findByDescription(description);
        if (!pt2 || pt2.id === id) {
            return await productTypeRepository.update(id, description);
        }
        return new BadRequestError("Type already exists");

    }
}

export const productTypesService = new ProductTypesService();