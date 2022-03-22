"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTypesController = void 0;
const ProductTypesService_1 = require("../../service/Products/ProductTypesService");
const PaginationService_1 = require("../../service/PaginationService");
class ProductTypesController {
    async count(request, response) {
        const result = await ProductTypesController.getService().count();
        response.status(result.statusCode).send(result);
    }
    async list(request, response) {
        const { skip, limit } = await PaginationService_1.PaginationService.getInstance().getPagination(request.query);
        const result = await ProductTypesController.getService().list(skip, limit);
        response.status(result.statusCode).send(result);
    }
    async listProductTypesWithMinPricesAvailable(request, response) {
        const { skip, limit } = await PaginationService_1.PaginationService.getInstance().getPagination(request.query);
        const result = await ProductTypesController
            .getService()
            .listProductTypesWithMinPricesAvailable(skip, limit);
        response.status(result.statusCode).send(result);
    }
    async create(request, response) {
        const { description } = request.body;
        const result = await ProductTypesController.getService().create(description);
        response.status(result.statusCode).send(result);
    }
    async get(request, response) {
        const { id } = request.params;
        const result = await ProductTypesController.getService().get(Number(id));
        response.status(result.statusCode).send(result);
    }
    async delete(request, response) {
        const { id } = request.params;
        const result = await ProductTypesController.getService().delete(Number(id));
        response.status(result.statusCode).send(result);
    }
    async update(request, response) {
        const { id } = request.params;
        const { description, image } = request.body;
        const result = await ProductTypesController.getService().update(Number(id), { description, image });
        response.status(result.statusCode).send(result);
    }
}
exports.ProductTypesController = ProductTypesController;
_a = ProductTypesController;
ProductTypesController.getService = () => {
    if (!_a.service) {
        ProductTypesController.service = new ProductTypesService_1.ProductTypesService();
    }
    return ProductTypesController.service;
};
//# sourceMappingURL=ProductTypesController.js.map