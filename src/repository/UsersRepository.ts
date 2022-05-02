import { User, UserModel } from "../domain/Users";
import InternalServerErrorError from "../utils/errors/InternalServerErrorError";
import logger from "../utils/Logger";
import { DefaultRepository } from "./DefaultRepository";

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
