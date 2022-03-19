import {Request, Response} from "express";
import {ProductTypesService} from "../../service/Products/ProductTypesService";
import {PaginationService} from "../../service/PaginationService";

const DEFAULT_PAGE_SIZE = 15;

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

    async listProductTypesWithMinPricesAvailable(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query)
        const result = await ProductTypesController
                                .getService()
                                .listProductTypesWithMinPricesAvailable(skip, limit);
        response.status(result.statusCode).send(result);
    }

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
        const { description, image } = request.body;
        const result = await ProductTypesController.getService().update(Number(id), {description, image});
        response.status(result.statusCode).send(result);
    }

}