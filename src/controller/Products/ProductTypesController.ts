import {Request, Response} from "express";
import {ProductTypesService} from "../../service/Products/ProductTypesService";
import {PaginationService} from "../../service/PaginationService";

export class ProductTypesController {

    static service: ProductTypesService;

    async count(request: Request, response: Response) {
        const result = await ProductTypesController.getService().count();
        response.status(result.statusCode).send(result);
    }

    async list(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query)
        const result = await ProductTypesController.getService().list(skip, limit);
        response.status(result.statusCode).send(result);
    }

    static getService = () => {
        if (!this.service) {
            ProductTypesController.service = new ProductTypesService();
        }
        return ProductTypesController.service;
    }

    async create(request: Request, response: Response) {
        const { description, image } = request.body;
        const result = await ProductTypesController.getService().create({description, image});
        response.status(result.statusCode).send(result);
    }


    async get(request: Request, response: Response) {
        const { id } = request.params;
        const result = await ProductTypesController.getService().get(Number(id));
        response.status(result.statusCode).send(result);
    }

    async getByDescription(request: Request, response: Response) {
        const { description } = request.params;
        const result = await ProductTypesController.getService().getByDescription(description);
        response.status(result.statusCode).send(result);
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const result = await ProductTypesController.getService().delete(Number(id));
        response.status(result.statusCode).send(result);

    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { description, image } = request.body;
        const result = await ProductTypesController.getService().update(Number(id), {description, image});
        response.status(result.statusCode).send(result);
    }

}