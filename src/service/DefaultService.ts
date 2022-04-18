import {DefaultRepository} from "../domain/DefaultRepository";
import NotFoundError from "../utils/errors/NotFoundError";

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
        if (!await this.repository.findById(id)) {
            return new NotFoundError(`${this.name} with ID ${id} doesn't exist`);
        }
        return await this.repository.delete(id);
    }
}