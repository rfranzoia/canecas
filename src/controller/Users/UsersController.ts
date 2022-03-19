import {Request, Response} from "express";
import {UsersService} from "../../service/Users/UsersService";
import {PaginationService} from "../../service/PaginationService";

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
        response.status(result.statusCode).send(result);
    }

    async list(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const result = await UsersController.getService().list(skip, limit);
        response.status(result.statusCode).send(result);
    }

    async listByUserRole(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const {role} = request.params;
        const result = await UsersController.getService().listByRole(role, skip, limit);
        response.status(result.statusCode).send(result);
    }

    async get(request: Request, response: Response) {
        const {id} = request.params;
        const result = await UsersController.getService().get(Number(id));
        response.status(result.statusCode).send(result);
    }

    async getByEmail(request: Request, response: Response) {
        const {email} = request.params;
        const result = await UsersController.getService().getByEmail(email);
        response.status(result.statusCode).send(result);
    }

    async create(request: Request, response: Response) {
        const {role, name, email, password, phone, address} = request.body;
        const result = await UsersController.getService().create({role, name, email, password, phone,address});
        response.status(result.statusCode).send(result);
    }

    async delete(request: Request, response: Response) {
        const authUser = request["user"];
        const {id} = request.params;
        const result = await UsersController.getService().delete(Number(id), authUser);
        response.status(result.statusCode).send(result);
    }

    async update(request: Request, response: Response) {
        const {id} = request.params;
        const {name, phone, address} = request.body;
        const result = await UsersController.getService().update(Number(id), {name, phone, address})
        response.status(result.statusCode).send(result);
    }

    async updatePassword(request: Request, response: Response) {
        const authUser = request["user"];
        const {email, old_password, new_password} = request.body;
        const result = await UsersController.getService().updatePassword(email, old_password, new_password, authUser);
        response.status(result.statusCode).send(result);
    }

    async login(request: Request, response: Response) {
        const {email, password} = request.body;
        const result = await UsersController.getService().authenticate(email, password);
        response.status(result.statusCode).send(result);
    }
}