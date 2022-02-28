import {Request, Response} from "express";
import {ProductTypesService} from "../service/ProductTypesService";

const DEFAULT_PAGE_SIZE = 15;

export class ProductTypesController {

    async create(request: Request, response: Response) {
        const { description } = request.body;
        const service = new ProductTypesService();
        const result = await service.create(description);
        response.status(result.statusCode).send(result);
    }

    async count(request: Request, response: Response) {
        const service = new ProductTypesService();
        const {pageSize} = request.query;
        const result = await service.count(Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }
    async list(request: Request, response: Response) {
        const service = new ProductTypesService();
        const {pageNumber, pageSize} = request.query;
        const result = await service.list(Number(pageNumber || 0), Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }


    async get(request: Request, response: Response) {
        const service = new ProductTypesService();
        const { id } = request.params;
        const result = await service.get(Number(id));
        response.status(result.statusCode).send(result);
    }

    async delete(request: Request, response: Response) {
        const service = new ProductTypesService();
        const { id } = request.params;
        const result = await service.delete(Number(id));
        response.status(result.statusCode).send(result);

    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { description } = request.body;
        const service = new ProductTypesService();
        const result = await service.update(Number(id), description);
        response.status(result.statusCode).send(result);
    }

}