import {Request, Response} from "express";
import {ProductPricesService, ProductPriceRequest} from "../service/ProductPricesService";

const DEFAULT_PAGE_SIZE = 15;

export class ProductPriceController {

    async list(request: Request, response: Response) {
        const service = new ProductPricesService();
        const {pageNumber, pageSize} = request.query;
        const result = await service.list(Number(pageNumber || 0), Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }

    async listByProduct(request: Request, response: Response) {
        const service = new ProductPricesService();
        const {productId} = request.params;
        const result = await service.listByProduct(Number(productId));
        response.status(result.statusCode).send(result);
    }

    async delete(request: Request, response: Response) {
        const service = new ProductPricesService();
        const {id} = request.params;
        const result = await service.delete(Number(id));
        response.status(result.statusCode).send(result);
    }

    async deleteByProduct(request: Request, response: Response) {
        const service = new ProductPricesService();
        const {productId} = request.params;
        const result = await service.deleteByProduct(Number(productId));
        response.status(result.statusCode).send(result);
    }

    async create(request: Request, response: Response) {
        const service = new ProductPricesService();
        const {product_id, price, validFrom, validTo} = request.body;

        let createRequest = {
            product_id: Number(product_id),
            price: Number(price),
            validFrom: new Date(validFrom),
            validTo: new Date(validTo)
        }
        
        const result = await service.create(createRequest);
        response.status(result.statusCode).send(result);
    }

    async createAll(request: Request, response: Response) {
        const service = new ProductPricesService();
        const { data } = request.body;
        const result = await service.createAll(data);
        response.status(result.statusCode).send(result);
    }
}