import bcrypt from "bcrypt";
import { Role, User } from "../../domain/Users/Users";
import { userRepository } from "../../domain/Users/UsersRepository";
import { tokenService } from "../../security/TokenService";
import BadRequestError from "../../utils/errors/BadRequestError";
import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import NotFoundError from "../../utils/errors/NotFoundError";
import UnauthorizedError from "../../utils/errors/UnauthorizedError";
import logger from "../../utils/Logger";
import { DefaultService } from "../DefaultService";

class UsersService extends DefaultService<User> {

    constructor() {
        super(userRepository, "User");
    }

    async getByEmail(email: string) {
        const user = await userRepository.findByEmail(email)
        if (!user) {
            return new NotFoundError(`No user found with email ${email}`);
        }
        return user;
    }

    async listByRole(role: string) {
        if (!(role in Role)) {
            return new BadRequestError("Role doesn't exists");
        }
        return await userRepository.findByRole(role);
    }

    async create(user: User) {
        if (await userRepository.findByEmail(user.email)) {
            return new BadRequestError("User email already in use");
        } else if (!(user.role in Role)) {
            return new BadRequestError("User role is not valid");
        }
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            if (!await bcrypt.compare(user.password, hashedPassword)) logger.info("not the same");
            user = {
                ...user,
                password: hashedPassword
            }
            return await userRepository.create(user);
        } catch (error) {
            logger.error("Error while creating", error.stack);
            return new InternalServerErrorError("Error while creating the new User", error);
        }
    }

    async update(id: string, user: User) {
        try {
            const u = await userRepository.findById(id);
            if (!u) {
                return new NotFoundError(`No user found with ID ${id}`);
            }
            const u2 = await userRepository.findByEmail(user.email);
            if (!u2 || u2.id === id) {
                return await userRepository.update(id, user);
            }
            return new BadRequestError("User email is already in use");
        } catch (error) {
            logger.error("Error while updating user", error.stack);
            return new InternalServerErrorError("Error while updating user", error);
        }
    }

    async updatePassword(email: string, currentPassword: string, newPassword: string) {
        try {
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return new NotFoundError(`No user found with Email ${email}`);
            } else if (!await bcrypt.compare(currentPassword, user.password)) {
                return new BadRequestError("Invalid current password");
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            return await userRepository.updatePassword(email, hashedPassword);
        } catch (error) {
            logger.error("Error while updating password", error.stack);
            return new InternalServerErrorError("Error while updating the password", error);
        }
    }

    async authenticate(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return new UnauthorizedError("Incorrect Email/Password");
        }

        try {
            if (!await bcrypt.compare(password, user.password)) {
                return new UnauthorizedError("Incorrect Email/Password");
            }

            const token = tokenService.generateToken({ id: user.id, email: user.email, name: user.name });

            return {
                _id: user.id,
                email: email,
                name: user.name,
                role: user.role,
                authToken: token
            };
        } catch (error) {
            logger.error("Invalid username/password error", error);
            return new UnauthorizedError("Incorrect Email/Password");
        }
    }
}

export const userService = new UsersService();
