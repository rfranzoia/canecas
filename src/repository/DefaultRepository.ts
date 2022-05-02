import mongoose from "mongoose";
import { ProductModel } from "../domain/Product";
import DatabaseError from "../utils/errors/DatabaseError";
import InternalServerErrorError from "../utils/errors/InternalServerErrorError";
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

    async findById<ID>(id: ID) {
        try {
            return await this.model.findOne({ _id: id }, { '__v': 0, });
        } catch (error) {
            logger.error("error searching for ID", error.stack)
            return new NotFoundError(`Error searching for ID ${id}`, error)
        }

    }

    async create<T>(model: T) {
        try {
            const m = await this.model.create(model);
            await m.save();
            return m;
        } catch (error) {
            logger.error("Error creating", error);
            return new InternalServerErrorError(error);
        }
    }

    async update<ID, T>(id: ID, model: T) {
        try {
            return await ProductModel.findOneAndUpdate({ _id: id }, model, { returnOriginal: false });
        } catch (error) {
            logger.error("Error updating", error);
            return new InternalServerErrorError(error);
        }
    }

    async delete<ID>(id: ID) {
        try {
            return await this.model.deleteOne({ _id: id });
        } catch (error) {
            logger.error("Error deleting", error);
            return new DatabaseError("Error while deleting");
        }
    }
}