import {DefaultRepository} from "../domain/DefaultRepository";
import NotFoundError from "../utils/errors/NotFoundError";
import BadRequestError from "../utils/errors/BadRequestError";

export class DefaultService<DefaultModel> {

    repository: DefaultRepository<DefaultModel>;
    name: string;

    constructor(repository: DefaultRepository<DefaultModel>, name: string = "Model") {
        this.repository = repository;
        this.name = name;
    }

    async count() {
        return await this.repository.count({});
    }

    async list(skip: number, limit: number) {
        return await this.repository.findAll({}, skip, limit);
    }

    async get(id: string) {
        return await this.repository.findById(id);
    }

    async delete(id: string) {
        if (!id) {
            return new BadRequestError(`Invalid ID for ${this.name} while trying to delete`);
        }
        if (!await this.repository.findById(id)) {
            return new NotFoundError(`${this.name} with ID ${id} doesn't exist`);
        }
        return await this.repository.delete(id);
    }
}