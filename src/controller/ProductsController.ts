import {Request, Response} from "express";
import {ProductsService} from "../service/ProductsService";

const DEFAULT_PAGE_SIZE = 15;

export class ProductsController {

    static service: ProductsService;

    static getService = () => {
        if (!this.service) {
            ProductsController.service = new ProductsService();
        }
        return ProductsController.service;
    }

    async create(request: Request, response: Response) {
        const {name, description, product_type_id, image} = request.body;

        const result = await ProductsController.getService().create({
            name, description, product_type_id, image
        });

        response.status(result.statusCode).send(result);
    }

    async count(request: Request, response: Response) {
        const {pageSize} = request.query;
        const result = await ProductsController.getService().count(Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }

    async list(request: Request, response: Response) {
        const {pageNumber, pageSize} = request.query;
        const result = await ProductsController.getService().list(Number(pageNumber || 0), Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }

    async get(request: Request, response: Response) {
        const {id} = request.params;
        const result = await ProductsController.getService().get(Number(id));
        response.status(result.statusCode).send(result);
    }

    async delete(request: Request, response: Response) {
        const {id} = request.params;
        const result = await ProductsController.getService().delete(Number(id));
        response.status(result.statusCode).send(result);
    }

    async update(request: Request, response: Response) {
        const {id} = request.params;
        const {name, description, product_type_id, image} = request.body;
        const result = await ProductsController.getService().update(Number(id), {name, description, product_type_id, image});
        response.status(result.statusCode).send(result);
    }
}