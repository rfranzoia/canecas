import {Request, Response} from "express";
import {ProductTypesService} from "../service/ProductTypesService";

const DEFAULT_PAGE_SIZE = 15;

export class ProductTypesController {

    static service: ProductTypesService;

    static getService = () => {
        if (!this.service) {
            ProductTypesController.service = new ProductTypesService();
        }
        return ProductTypesController.service;
    }

    async create(request: Request, response: Response) {
        const { description } = request.body;
        const result = await ProductTypesController.getService().create(description);
        response.status(result.statusCode).send(result);
    }

    async count(request: Request, response: Response) {
        const {pageSize} = request.query;
        const result = await ProductTypesController.getService().count(Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }
    async list(request: Request, response: Response) {
        const {pageNumber, pageSize} = request.query;
        const result = await ProductTypesController.getService().list(Number(pageNumber || 0), Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }


    async get(request: Request, response: Response) {
        const { id } = request.params;
        const result = await ProductTypesController.getService().get(Number(id));
        response.status(result.statusCode).send(result);
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const result = await ProductTypesController.getService().delete(Number(id));
        response.status(result.statusCode).send(result);

    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { description } = request.body;
        const result = await ProductTypesController.getService().update(Number(id), description);
        response.status(result.statusCode).send(result);
    }

}