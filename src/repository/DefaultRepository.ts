import mongoose from "mongoose";
import DatabaseError from "../utils/errors/DatabaseError";
import NotFoundError from "../utils/errors/NotFoundError";
import logger from "../utils/Logger";

export interface DefaultModel {
}

export class DefaultRepository<DefaultModel> {

    model: mongoose.Model<DefaultModel>

    constructor(model: mongoose.Model<DefaultModel>) {
        this.model = model;
    }

    async count(filter: object) {
        return await this.model.count(filter);
    }

    async findAll(filter: object, skip: number, limit: number) {
        return await this.model.find(filter, {
            '__v': 0, 'password': 0,
        }).skip(skip)
            .limit(limit);
    }

    async findById(id: string) {
        try {
            return await this.model.findOne({ _id: id }, { '__v': 0, });
        } catch (error) {
            logger.error("error searching for ID", error.stack)
            return new NotFoundError(`Error searching for ID ${id}`, error)
        }

    }

    async delete(id: string) {
        try {
            return await this.model.deleteOne({ _id: id });
        } catch (error) {
            logger.error("Error deleting", error);
            return new DatabaseError("Error while deleting");
        }
    }
}