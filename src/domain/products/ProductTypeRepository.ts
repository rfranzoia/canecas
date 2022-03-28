import {ProductType, ProductTypeModel} from "./ProductType";
import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";

class ProductTypeRepository {

    async count() {
        return await ProductTypeModel.count();
    }

    async findAll() {
        return await ProductTypeModel.find({}, {
            '__v': 0,
        });
    }

    async findById(id: string) {
        return await ProductTypeModel.findOne({ _id: id }, { '__v': 0,});
    }

    async findByDescription(description: string) {
        return await ProductTypeModel.findOne({ description: description }, { '__v': 0,});
    }

    async create(productType: ProductType) {
        try {
            const type = await ProductTypeModel.create({
                description: productType.description
            });
            await type.save();
            return type;
        } catch (error) {
            return new InternalServerErrorError("Error creating the Type");
        }
    }

    async delete(id: string) {
        try {
            await ProductTypeModel.deleteOne({ _id: id });
        } catch (error) {
            return new InternalServerErrorError("Error while deleting the Type");
        }
    }

    async update(id: string, description: string) {
        const pt = await ProductTypeModel.findOneAndUpdate({ _id: id }, {
            description: description
        }, { returnOriginal: false  });
        console.log(pt);
        return pt;
    }
}

export const productTypeRepository = new ProductTypeRepository();