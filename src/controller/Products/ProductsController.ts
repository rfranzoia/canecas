import {Request, Response} from "express";
import {ProductsService} from "../../service/Products/ProductsService";
import {PaginationService} from "../../service/PaginationService";

export class ProductsController {

    static service: ProductsService;

    static getService = () => {
        if (!this.service) {
            ProductsController.service = new ProductsService();
        }
        return ProductsController.service;
    }

    async create(request: Request, response: Response) {
        const {name, description, product_type_id, image, price} = request.body;

        const result = await ProductsController.getService().create({
            name, description, product_type_id, image, price
        });

        response.status(result.statusCode).send(result);
    }

    async count(request: Request, response: Response) {
        const result = await ProductsController.getService().count();
        response.status(result.statusCode).send(result);
    }

    async list(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const result = await ProductsController.getService().list(skip, limit);
        response.status(result.statusCode).send(result);
    }

    async listByType(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const { product_type_id } = request.params;
        const result = await ProductsController.getService().listByProductType(Number(product_type_id), skip, limit);
        response.status(result.statusCode).send(result);
    }

    async listByPriceRange(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const { startPrice, endPrice } = request.params;
        const result = await ProductsController.getService().listByPriceRange(Number(startPrice), Number(endPrice), skip, limit);
        response.status(result.statusCode).send(result);
    }

    async get(request: Request, response: Response) {
        const {id} = request.params;
        const result = await ProductsController.getService().get(Number(id));
        response.status(result.statusCode).send(result);
    }

    async getByName(request: Request, response: Response) {
        const {name} = request.params;
        const result = await ProductsController.getService().getByName(name);
        response.status(result.statusCode).send(result);
    }

    async delete(request: Request, response: Response) {
        const {id} = request.params;
        const result = await ProductsController.getService().delete(Number(id));
        response.status(result.statusCode).send(result);
    }

    async update(request: Request, response: Response) {
        const {id} = request.params;
        const {name, description, product_type_id, image, price} = request.body;
        const result = await ProductsController.getService().update(Number(id), {name, description, product_type_id, image, price});
        response.status(result.statusCode).send(result);
    }
}