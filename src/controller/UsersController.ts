import {Request, Response} from "express";
import {UsersService} from "../service/UsersService";

const DEFAULT_PAGE_SIZE = 15;

export class UsersController {

    static service: UsersService;

    static getService = () => {
        if (!this.service) {
            UsersController.service = new UsersService();
        }
        return UsersController.service;
    }

    async count(request: Request, response: Response) {
        const {pageSize} = request.query;
        const result = await UsersController.getService().count(Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }

    async list(request: Request, response: Response) {
        const {pageNumber, pageSize} = request.query;
        const result = await UsersController.getService().list(Number(pageNumber || 0), Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }

    async listByUserRole(request: Request, response: Response) {
        const {pageNumber, pageSize} = request.query;
        const {role} = request.params;
        const result = await UsersController.getService().listByRole(role, Number(pageNumber || 0), Number(pageSize || DEFAULT_PAGE_SIZE));
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
        const {id} = request.params;
        const result = await UsersController.getService().delete(Number(id));
        response.status(result.statusCode).send(result);
    }

    async update(request: Request, response: Response) {
        const {id} = request.params;
        const {name, phone, address} = request.body;
        const result = await UsersController.getService().update(Number(id), {name, phone, address})
        response.status(result.statusCode).send(result);
    }

    async updatePassword(request: Request, response: Response) {
        const {email, old_password, new_password} = request.body;
        const result = await UsersController.getService().updatePassword(email, old_password, new_password);
        response.status(result.statusCode).send(result);
    }

    async login(request: Request, response: Response) {
        const {email, password} = request.body;
        const result = await UsersController.getService().authenticate(email, password);
        response.status(result.statusCode).send(result);
    }
}