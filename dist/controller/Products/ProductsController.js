"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const ProductsService_1 = require("../../service/Products/ProductsService");
const PaginationService_1 = require("../../service/PaginationService");
class ProductsController {
    async create(request, response) {
        const { name, description, product_type_id, image } = request.body;
        const result = await ProductsController.getService().create({
            name, description, product_type_id, image
        });
        response.status(result.statusCode).send(result);
    }
    async count(request, response) {
        const result = await ProductsController.getService().count();
        response.status(result.statusCode).send(result);
    }
    async list(request, response) {
        const { skip, limit } = await PaginationService_1.PaginationService.getInstance().getPagination(request.query);
        const result = await ProductsController.getService().list(skip, limit);
        response.status(result.statusCode).send(result);
    }
    async listByType(request, response) {
        const { skip, limit } = await PaginationService_1.PaginationService.getInstance().getPagination(request.query);
        const { product_type_id } = request.params;
        const result = await ProductsController.getService().listByProductType(Number(product_type_id), skip, limit);
        response.status(result.statusCode).send(result);
    }
    async get(request, response) {
        const { id } = request.params;
        const result = await ProductsController.getService().get(Number(id));
        response.status(result.statusCode).send(result);
    }
    async delete(request, response) {
        const { id } = request.params;
        const result = await ProductsController.getService().delete(Number(id));
        response.status(result.statusCode).send(result);
    }
    async update(request, response) {
        const { id } = request.params;
        const { name, description, product_type_id, image } = request.body;
        const result = await ProductsController.getService().update(Number(id), { name, description, product_type_id, image });
        response.status(result.statusCode).send(result);
    }
}
exports.ProductsController = ProductsController;
_a = ProductsController;
ProductsController.getService = () => {
    if (!_a.service) {
        ProductsController.service = new ProductsService_1.ProductsService();
    }
    return ProductsController.service;
};
//# sourceMappingURL=ProductsController.js.map