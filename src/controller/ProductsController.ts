import {Request, Response} from "express";
import {ProductsService} from "../service/ProductsService";

const DEFAULT_PAGE_SIZE = 15;

export class ProductsController {

    async create(request: Request, response: Response) {
        const {name, description, product_type_id, image} = request.body;
        const service = new ProductsService();

        const result = await service.create({
            name, description, product_type_id, image
        });

        response.status(result.statusCode).send(result);
    }

    async count(request: Request, response: Response) {
        const service = new ProductsService();
        const {pageSize} = request.query;
        const result = await service.count(Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }

    async list(request: Request, response: Response) {
        const service = new ProductsService();
        const {pageNumber, pageSize} = request.query;
        const result = await service.list(Number(pageNumber || 0), Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }

    async get(request: Request, response: Response) {
        const service = new ProductsService();
        const {id} = request.params;
        const result = await service.get(Number(id));
        response.status(result.statusCode).send(result);
    }

    async delete(request: Request, response: Response) {
        const service = new ProductsService();
        const {id} = request.params;
        const result = await service.delete(Number(id));
        response.status(result.statusCode).send(result);
    }

    async update(request: Request, response: Response) {
        const service = new ProductsService();
        const {id} = request.params;
        const {name, description, product_type_id, image} = request.body;
        const result = await service.update(Number(id), {name, description, product_type_id, image});
        response.status(result.statusCode).send(result);
    }
}