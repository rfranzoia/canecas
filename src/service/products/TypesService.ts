import {Type} from "../../domain/products/Type";
import BadRequestError from "../../utils/errors/BadRequestError";
import NotFoundError from "../../utils/errors/NotFoundError";
import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import {typeRepository} from "../../domain/products/TypeRepository";

class TypesService {

    async count() {
        return await typeRepository.count();
    }

    async list() {
        return await typeRepository.findAll();
    }

    async findById(id: string) {
        const pt = await typeRepository.findById(id);
        if (!pt) {
            return new NotFoundError(`No type found with ID ${id}`);
        }
        return pt;
    }

    async findByDescription(description: string) {
        const pt = await typeRepository.findByDescription(description)
        if (!pt) {
            return new NotFoundError(`No type found with description ${description}`);
        }
        return pt;
    }

    async create(type: Type) {
        const pt = await typeRepository.findByDescription(type.description);
        if (pt) {
            return new BadRequestError(`Type already exists with the description ${type.description}`);
        }
        return await typeRepository.create(type);
    }

    async delete(id: string) {
        const pt = await typeRepository.findById(id);
        if (!pt) {
            return new NotFoundError(`No type found with ID ${id}`);
        }
        const result = await typeRepository.delete(id);
        if (result instanceof InternalServerErrorError) {
            return result;
        }
    }

    async update(id: string, description: string, image: string) {
        const pt = await typeRepository.findById(id);
        if (!pt) {
            return new NotFoundError(`No type found with ID ${id}`);
        }
        const pt2 = await typeRepository.findByDescription(description);
        if (!pt2 || pt2.id === id) {
            return await typeRepository.update(id, description, image);
        }
        return new BadRequestError(`Type already exists with the description ${description}`);

    }
}

export const typesService = new TypesService();