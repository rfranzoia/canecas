"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPriceController = void 0;
const ProductPricesService_1 = require("../../service/Products/ProductPricesService");
const PaginationService_1 = require("../../service/PaginationService");
class ProductPriceController {
    async list(request, response) {
        const { skip, limit } = await PaginationService_1.PaginationService.getInstance().getPagination(request.query);
        const result = await ProductPriceController.getService().list(skip, limit);
        response.status(result.statusCode).send(result);
    }
    async listByProduct(request, response) {
        const { productId } = request.params;
        const { skip, limit } = await PaginationService_1.PaginationService.getInstance().getPagination(request.query);
        const result = await ProductPriceController.getService().listByProduct(Number(productId), skip, limit);
        response.status(result.statusCode).send(result);
    }
    async listDistinctProductTypePrices(request, response) {
        const { productTypeId } = request.params;
        const { skip, limit } = await PaginationService_1.PaginationService.getInstance().getPagination(request.query);
        const result = await ProductPriceController.getService().listDistinctProductTypePrices(Number(productTypeId), skip, limit);
        response.status(result.statusCode).send(result);
    }
    async delete(request, response) {
        const { id } = request.params;
        const result = await ProductPriceController.getService().delete(Number(id));
        response.status(result.statusCode).send(result);
    }
    async deleteByProduct(request, response) {
        const { productId } = request.params;
        const result = await ProductPriceController.getService().deleteByProduct(Number(productId));
        response.status(result.statusCode).send(result);
    }
    async create(request, response) {
        const { product_id, price, validFrom, validTo } = request.body;
        let createRequest = {
            product_id: Number(product_id),
            price: Number(price),
            validFrom: new Date(validFrom),
            validTo: new Date(validTo)
        };
        const result = await ProductPriceController.getService().create(createRequest);
        response.status(result.statusCode).send(result);
    }
    async createAll(request, response) {
        const { data } = request.body;
        const result = await ProductPriceController.getService().createAll(data);
        response.status(result.statusCode).send(result);
    }
}
exports.ProductPriceController = ProductPriceController;
_a = ProductPriceController;
ProductPriceController.getService = () => {
    if (!_a.service) {
        ProductPriceController.service = new ProductPricesService_1.ProductPricesService();
    }
    return ProductPriceController.service;
};
//# sourceMappingURL=ProductPriceController.js.map