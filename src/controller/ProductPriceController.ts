import {Request, Response} from "express";
import {ProductPricesService} from "../service/ProductPricesService";

const DEFAULT_PAGE_SIZE = 15;

export class ProductPriceController {

    static service: ProductPricesService;

    static getService = () => {
        if (!this.service) {
            ProductPriceController.service = new ProductPricesService();
        }
        return ProductPriceController.service;
    }

    async list(request: Request, response: Response) {
        const {pageNumber, pageSize} = request.query;
        const result = await ProductPriceController.getService().list(Number(pageNumber || 0), Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }

    async listByProduct(request: Request, response: Response) {
        const {productId} = request.params;
        const result = await ProductPriceController.getService().listByProduct(Number(productId));
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
        const {product_id, price, validFrom, validTo} = request.body;

        let createRequest = {
            product_id: Number(product_id),
            price: Number(price),
            validFrom: new Date(validFrom),
            validTo: new Date(validTo)
        }
        
        const result = await ProductPriceController.getService().create(createRequest);
        response.status(result.statusCode).send(result);
    }

    async createAll(request: Request, response: Response) {
        const { data } = request.body;
        const result = await ProductPriceController.getService().createAll(data);
        response.status(result.statusCode).send(result);
    }
}