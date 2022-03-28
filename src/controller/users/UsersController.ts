import {StatusCodes} from "http-status-codes";
import BadRequestError from "../../utils/errors/BadRequestError";
import NotFoundError from "../../utils/errors/NotFoundError";
import UnauthorizedError from "../../utils/errors/UnauthorizedError";
import {User} from "../../domain/Users/Users";
import {userService} from "../../service/users/UsersService";
import {evaluateResult} from "../ControllerHelper";

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
        return evaluateResult(user, res, StatusCodes.CREATED, user);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await userService.delete(id);
        return evaluateResult(result, res, StatusCodes.NO_CONTENT, { message: "User deleted successfully" });
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
        return evaluateResult(result, res, StatusCodes.OK, await userService.get(id));
    }

    async updatePassword(req, res) {
        const { email, currentPassword, newPassword } = req.body;
        const result = await userService.updatePassword(email, currentPassword, newPassword);
        return evaluateResult(result, res, StatusCodes.OK, await userService.getByEmail(email));
    }

    async login(req, res) {
        const {email, password} = req.body;
        const result = await userService.authenticate(email, password);
        if (result instanceof UnauthorizedError) {
            return res.status(StatusCodes.UNAUTHORIZED).send(result as UnauthorizedError);
        }
        const user = {
            ...result._doc,
            authToken: result.authToken
        }
        return res.status(StatusCodes.OK).send(user);
    }

}