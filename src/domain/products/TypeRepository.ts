import {Type, TypeModel} from "./Type";
import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";

class TypeRepository {

    async count() {
        return await TypeModel.count();
    }

    async findAll() {
        return await TypeModel.find({}, {
            '__v': 0,
        });
    }

    async findById(id: string) {
        return await TypeModel.findOne({ _id: id }, { '__v': 0,});
    }

    async findByDescription(description: string) {
        return await TypeModel.findOne({ description: description }, { '__v': 0,});
    }

    async create(type: Type) {
        try {
            const t = await TypeModel.create({
                description: type.description,
                image: type.image
            });
            await t.save();
            return t;
        } catch (error) {
            return new InternalServerErrorError("Error creating the Type");
        }
    }

    async delete(id: string) {
        try {
            await TypeModel.deleteOne({ _id: id });
        } catch (error) {
            return new InternalServerErrorError("Error while deleting the Type");
        }
    }

    async update(id: string, description: string, image: string) {
        return await TypeModel.findOneAndUpdate({ _id: id }, {
            description: description,
            image: image
        }, { returnOriginal: false  });
    }
}

export const typeRepository = new TypeRepository();