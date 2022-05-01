import { DefaultRepository } from "../repository/DefaultRepository";
import BadRequestError from "../utils/errors/BadRequestError";
import NotFoundError from "../utils/errors/NotFoundError";

export class DefaultService<DefaultModel> {

    repository: DefaultRepository<DefaultModel>;
    name: string;

    constructor(repository: DefaultRepository<DefaultModel>, name: string = "Model") {
        this.repository = repository;
        this.name = name;
    }

    async count(filter) {
        return await this.repository.count(filter);
    }

    async list(filter, skip: number, limit: number) {
        return await this.repository.findAll(filter, skip, limit);
    }

    async get(id: string) {
        if (!id) {
            return new BadRequestError(`Invalid ID for ${this.name} on get`);
        }
        const result = await this.repository.findById(id);
        if (!result) {
            return new NotFoundError(`${this.name} with ID ${id} doesn't exist`);
        }
        return result;
    }

    async delete(id: string) {
        if (!id) {
            return new BadRequestError(`Invalid ID for ${this.name} on delete`);
        }
        if (!await this.repository.findById(id)) {
            return new NotFoundError(`${this.name} with ID ${id} doesn't exist`);
        }
        return await this.repository.delete(id);
    }
}