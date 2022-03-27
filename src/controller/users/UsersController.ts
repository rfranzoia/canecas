import {StatusCodes} from "http-status-codes";
import BadRequestError from "../../utils/errors/BadRequestError";
import NotFoundError from "../../utils/errors/NotFoundError";
import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import {User} from "../../domain/Users/Users";
import {userService} from "../../service/users/UsersService";

export class UsersController {

    async count(req, res) {
        return res.status(StatusCodes.OK).send({ count: await userService.count() });
    }

    async get(req, res) {
        const { id } = req.params;
        const user = await userService.get(id);
        if (user instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send("User not found");
        }
        return res.status(StatusCodes.OK).send(user);
    }


    async getByName(req, res) {
        const { name } = req.params;
        const user = await userService.getByName(name);
        if (user instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send("User not found!");
        }
        return res.status(StatusCodes.OK).send(user);
    }

    async getByEmail(req, res) {
        const { email } = req.params;
        const user = await userService.getByEmail(email);
        if (user instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send("User not found!");
        }
        return res.status(StatusCodes.OK).send(user);
    }

    async list(req, res) {
        return res.status(StatusCodes.OK).send(await userService.list());
    }

    async listByRole(req, res) {
        const { role } = req.params;
        const result = res.status(StatusCodes.OK).send(await userService.listByRole(role));
        if (result instanceof BadRequestError) {
            return res.status(StatusCodes.BAD_REQUEST).send(result as BadRequestError);
        }
        return result;
    }

    async create(req, res) {
        const { name, email, password, role, phone, address } = req.body;
        const u: User = {
            name: name,
            email: email,
            password: password,
            role: role,
            phone: phone,
            address: address
        }
        const user = await userService.create(u);
        if (user instanceof InternalServerErrorError) {
            const error = user as InternalServerErrorError;
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);

        } else if (user instanceof BadRequestError) {
            const error = user as BadRequestError;
            return res.status(StatusCodes.BAD_REQUEST).send(error);
        }

        return res.status(StatusCodes.CREATED).send(user);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await userService.delete(id);
        if (result instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send("User not found!");

        } else if (result instanceof InternalServerErrorError) {
            const error = result as InternalServerErrorError;
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "Error while deleting the user", error: error });
        }
        return res.status(StatusCodes.NO_CONTENT).send({ message: "User deleted successfully" });
    }

    async update(req, res) {
        const { id } = req.params;
        const { name, role, phone, address } = req.body;
        const user: User = {
            name: name,
            role: role,
            phone: phone,
            address: address
        }
        const result = await userService.update(id, user);
        if (result instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send("User not found!");

        } else if (result instanceof InternalServerErrorError) {
            const error = result as InternalServerErrorError;
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "Error while updating the user", error: error });

        } else if (result instanceof BadRequestError) {
            const error = result as BadRequestError;
            return res.status(StatusCodes.BAD_REQUEST).send(error);
        }
        return res.status(StatusCodes.OK).send(await userService.get(id));
    }

    async updatePassword(req, res) {
        const { email, currentPassword, newPassword } = req.body;
        const result = await userService.updatePassword(email, currentPassword, newPassword);
        if (result instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send(result as NotFoundError);

        } else if (result instanceof InternalServerErrorError) {
            const error = result as InternalServerErrorError;
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "Error while updating the users password", error: error });

        } else if (result instanceof BadRequestError) {
            const error = result as BadRequestError;
            return res.status(StatusCodes.BAD_REQUEST).send(error);
        }
        return res.status(StatusCodes.OK).send(await userService.getByEmail(email));
    }

}