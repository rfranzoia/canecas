import {Request, Response} from "express";
import {UsersService} from "../../service/Users/UsersService";
import {PaginationService} from "../../service/PaginationService";
import {StatusCodes} from "http-status-codes";
import {ResponseData} from "../ResponseData";
import NotFoundError from "../../utils/errors/NotFoundError";
import BadRequestError from "../../utils/errors/BadRequestError";
import InternalServerError from "../../utils/errors/InternalServerError";
import UnauthorizedError from "../../utils/errors/UnauthorizedError";

export class UsersController {

    static service: UsersService;

    static getService = () => {
        if (!this.service) {
            UsersController.service = new UsersService();
        }
        return UsersController.service;
    }

    async count(request: Request, response: Response) {
        const result = await UsersController.getService().count();
        response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", {count: result}));
    }

    async list(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const result = await UsersController.getService().list(skip, limit);
        response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
    }

    async listByUserRole(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const {role} = request.params;
        const result = await UsersController.getService().listByRole(role, skip, limit);
        response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
    }

    async get(request: Request, response: Response) {
        const {id} = request.params;
        const result = await UsersController.getService().get(Number(id));
        if (result instanceof NotFoundError) {
            return response.status(result.statusCode).send(new ResponseData(result.statusCode, result.message, result));
        }
        return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
    }

    async getByEmail(request: Request, response: Response) {
        const {email} = request.params;
        const result = await UsersController.getService().getByEmail(email);
        if (result instanceof NotFoundError) {
            return response.status(result.statusCode).send(new ResponseData(result.statusCode, result.message, result));
        }
        return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
    }

    async create(request: Request, response: Response) {
        const {role, name, email, password, phone, address} = request.body;
        const result = await UsersController.getService().create({role, name, email, password, phone, address});
        if (result instanceof BadRequestError) {
            return response.status(StatusCodes.BAD_REQUEST).send(new ResponseData(result.statusCode, result.message, result));
        } else if (result instanceof InternalServerError) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new ResponseData(result.statusCode, result.message, result));
        }
        return response.status(StatusCodes.CREATED).send(new ResponseData(StatusCodes.OK, "", result));
    }

    async delete(request: Request, response: Response) {
        const {id} = request.params;
        const result = await UsersController.getService().delete(Number(id));
        if (result instanceof NotFoundError) {
            return response.status(StatusCodes.NOT_FOUND).send(new ResponseData(result.statusCode, result.message, result));
        }
        return response.status(StatusCodes.NO_CONTENT).send(new ResponseData(StatusCodes.NO_CONTENT, "Usuário removido com sucesso"));
    }

    async update(request: Request, response: Response) {
        const {id} = request.params;
        const {name, phone, address} = request.body;
        const result = await UsersController.getService().update(Number(id), {name, phone, address});
        if (result instanceof NotFoundError) {
            return response.status(StatusCodes.NOT_FOUND).send(new ResponseData(result.statusCode, result.message, result));
        }
        return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "usuário atualizado com Sucesso!", result));
    }

    async updatePassword(request: Request, response: Response) {
        const {email, old_password, new_password} = request.body;
        const result = await UsersController.getService().updatePassword(email, old_password, new_password);
        if (result instanceof UnauthorizedError) {
            return response.status(StatusCodes.UNAUTHORIZED).send(new ResponseData(result.statusCode, result.message, result));
        } else if (result instanceof InternalServerError) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new ResponseData(result.statusCode, result.message, result));
        }
        return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "Senha atualizada com Sucesso!", result));
    }

    async login(request: Request, response: Response) {
        const {email, password} = request.body;
        const result = await UsersController.getService().authenticate(email, password);
        if (result instanceof UnauthorizedError) {
            return response.status(StatusCodes.UNAUTHORIZED).send(new ResponseData(result.statusCode, result.message, result));
        }
        return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
    }
}