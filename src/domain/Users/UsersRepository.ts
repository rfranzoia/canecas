import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import {User, UserModel} from "./Users";
import logger from "../../utils/Logger";

class UserRepository {

    async count() {
        return await UserModel.count();
    }

    async findAll() {
        return await UserModel.find({}, {
            '__v': 0, 'password': 0,
        });
    }

    async findById(id: string) {
        return await UserModel.findOne({ _id: id }, { '__v': 0,});
    }

    async findByName(name: string) {
        return await UserModel.findOne({ name: name }, { '__v': 0, 'password': 0,});
    }

    async findByEmail(email: string) {
        return await UserModel.findOne({ email: email }, { '__v': 0,});
    }

    async findByRole(role: string) {
        return await UserModel.find({ role: role }, {
            '__v': 0, 'password': 0,
        });
    }

    async create(user: User) {
        try {
            const u = await UserModel.create({
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
                phone: user.phone,
                address: user.address
            });
            await u.save();
            return u;
        } catch (error) {
            logger.error("Error creating User", error);
            return new InternalServerErrorError("Error while creating the User");
        }
    }

    async delete(id: string) {
        try {
            await UserModel.deleteOne({ _id: id });
        } catch (error) {
            logger.error("Error deleting User", error);
            return new InternalServerErrorError("Error while deleting the User");
        }
    }

    async update(id: string, user: User) {
        try {
            return await UserModel.findOneAndUpdate({ _id: id }, {
                name: user.name,
                role: user.role,
                phone: user.phone,
                address: user.address
            }, { returnOriginal: false  });
        } catch (error) {
            logger.error("Error updating User", error);
            return new InternalServerErrorError(error);
        }
    }

    async updatePassword(email: string, password: string) {
        try {
            return await UserModel.findOneAndUpdate({ email: email }, {
                password: password
            }, { returnOriginal: false  });
        } catch (error) {
            logger.error("Error updating password", error);
            return new InternalServerErrorError(error);
        }
    }
}

export const userRepository = new UserRepository();
