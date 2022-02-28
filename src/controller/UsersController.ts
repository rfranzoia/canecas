import {Request, Response} from "express";
import {UsersService} from "../service/UsersService";

const DEFAULT_PAGE_SIZE = 15;

export class UsersController {

    async count(request: Request, response: Response) {
        const service = new UsersService();
        const {pageSize} = request.query;
        const result = await service.count(Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }

    async list(request: Request, response: Response) {
        const service = new UsersService();
        const {pageNumber, pageSize} = request.query;
        const result = await service.list(Number(pageNumber || 0), Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }

    async listByUserType(request: Request, response: Response) {
        const service = new UsersService();
        const {userType} = request.params;
        const result = await service.listByUserType(userType);
        response.status(result.statusCode).send(result);
    }

    async get(request: Request, response: Response) {
        const service = new UsersService();
        const {id} = request.params;
        const result = await service.get(Number(id));
        response.status(result.statusCode).send(result);
    }

    async getByEmail(request: Request, response: Response) {
        const service = new UsersService();
        const {email} = request.params;
        const result = await service.getByEmail(email);
        response.status(result.statusCode).send(result);
    }

    async create(request: Request, response: Response) {
        const service = new UsersService();
        const {userType, name, email, phone, address} = request.body;
        const result = await service.create({userType, name, email, phone,address});
        response.status(result.statusCode).send(result);
    }

    async delete(request: Request, response: Response) {
        const service = new UsersService();
        const {id} = request.params;
        const result = await service.delete(Number(id));
        response.status(result.statusCode).send(result);
    }

    async update(request: Request, response: Response) {
        const service = new UsersService();
        const {id} = request.params;
        const {name, phone, address} = request.body;
        const result = await service.update(Number(id), {name, phone, address})
        response.status(result.statusCode).send(result);
    }

    async updatePassword(request: Request, response: Response) {
        const service = new UsersService();
        const {email, password} = request.body;
        const result = await service.updatePassword(email, password);
        response.status(result.statusCode).send(result);
    }

    async login(request: Request, response: Response) {
        const service = new UsersService();
        const {email, password} = request.body;
        const result = await service.login(email, password);
        response.status(result.statusCode).send(result);
    }
}