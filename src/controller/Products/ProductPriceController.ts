import {Request, Response} from "express";
import {ProductPricesService} from "../../service/Products/ProductPricesService";
import {PaginationService} from "../../service/PaginationService";

export class ProductPriceController {

    static service: ProductPricesService;

    static getService = () => {
        if (!this.service) {
            ProductPriceController.service = new ProductPricesService();
        }
        return ProductPriceController.service;
    }

    async list(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const result = await ProductPriceController.getService().list(skip, limit);
        response.status(result.statusCode).send(result);
    }

    async listByProduct(request: Request, response: Response) {
        const {productId} = request.params;
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const result = await ProductPriceController.getService().listByProduct(Number(productId), skip, limit);
        response.status(result.statusCode).send(result);
    }

    async listDistinctProductTypePrices(request: Request, response: Response) {
        const {productTypeId} = request.params;
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const result = await ProductPriceController.getService().listDistinctProductTypePrices(Number(productTypeId), skip, limit);
        response.status(result.statusCode).send(result);
    }

    async delete(request: Request, response: Response) {
        const {id} = request.params;
        const result = await ProductPriceController.getService().delete(Number(id));
        response.status(result.statusCode).send(result);
    }

    async deleteByProduct(request: Request, response: Response) {
        const {productId} = request.params;
        const result = await ProductPriceController.getService().deleteByProduct(Number(productId));
        response.status(result.statusCode).send(result);
    }

    async create(request: Request, response: Response) {
        const {product_id, price, validUntil} = request.body;

        let createRequest = {
            product_id: Number(product_id),
            price: Number(price),
            validUntil: new Date(validUntil)
        }
        
        const result = await ProductPriceController.getService().create(createRequest);
        response.status(result.statusCode).send(result);
    }

}