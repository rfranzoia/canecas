import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import logger from "../../utils/Logger";
import { DefaultRepository } from "../DefaultRepository";
import { User, UserModel } from "./Users";

class UserRepository extends DefaultRepository<User> {

    constructor() {
        super(UserModel);
    }

    async findByEmail(email: string) {
        return await this.model.findOne({ email: email }, { '__v': 0, });
    }

    async findByRole(role: string) {
        return await this.model.find({ role: role }, {
            '__v': 0, 'password': 0,
        });
    }

    async create(user: User) {
        try {
            const u = await this.model.create({
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

    async update(id: string, user: User) {
        try {
            return await this.model.findOneAndUpdate({ _id: id }, {
                role: user.role,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            }, { returnOriginal: false });
        } catch (error) {
            logger.error("Error updating User", error);
            return new InternalServerErrorError(error);
        }
    }

    async updatePassword(email: string, password: string) {
        try {
            return await this.model.findOneAndUpdate({ email: email }, {
                password: password
            }, { returnOriginal: false });
        } catch (error) {
            logger.error("Error updating password", error);
            return new InternalServerErrorError(error);
        }
    }
}

export const userRepository = new UserRepository();
