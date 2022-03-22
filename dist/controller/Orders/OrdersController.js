"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const OrdersService_1 = require("../../service/Orders/OrdersService");
const PaginationService_1 = require("../../service/PaginationService");
class OrdersController {
    async count(request, response) {
        const result = await OrdersController.getService().count();
        response.status(result.statusCode).send(result);
    }
    async list(request, response) {
        const { skip, limit } = await PaginationService_1.PaginationService.getInstance().getPagination(request.query);
        const result = await OrdersController.getService().list(skip, limit);
        response.status(result.statusCode).send(result);
    }
    async listByDateRange(request, response) {
        const { skip, limit } = await PaginationService_1.PaginationService.getInstance().getPagination(request.query);
        const { start_date, end_date } = request.params;
        const result = await OrdersController.getService().listByDateRange(new Date(start_date), new Date(end_date), skip, limit);
        response.status(result.statusCode).send(result);
    }
    async listByUserAndStatus(request, response) {
        const { skip, limit } = await PaginationService_1.PaginationService.getInstance().getPagination(request.query);
        const { user_id, order_status } = request.params;
        const result = await OrdersController.getService().listByUserAndStatus(Number(user_id), order_status, skip, limit);
        response.status(result.statusCode).send(result);
    }
    async get(request, response) {
        const { id } = request.params;
        const result = await OrdersController.getService().get(id);
        response.status(result.statusCode).send(result);
    }
    async create(request, response) {
        const { user_id, orderItems } = request.body;
        const result = await OrdersController.getService().create(user_id, orderItems);
        response.status(result.statusCode).send(result);
    }
    async addRemoveOrderItems(request, response) {
        const { id } = request.params;
        const { orderItems } = request.body;
        const result = await OrdersController.getService().addRemoveOrderItems(id, orderItems);
        response.status(result.statusCode).send(result);
    }
    async delete(request, response) {
        const { id } = request.params;
        const result = await OrdersController.getService().deleteOrderAndItems(id);
        response.status(result.statusCode).send(result);
    }
    async updateStatus(request, response) {
        const { id } = request.params;
        const { orderStatus, changeReason } = request.body;
        const result = await OrdersController.getService().updateOrderStatus(id, orderStatus, changeReason);
        response.status(result.statusCode).send(result);
    }
}
exports.OrdersController = OrdersController;
_a = OrdersController;
OrdersController.getService = () => {
    if (!_a.service) {
        OrdersController.service = new OrdersService_1.OrdersService();
    }
    return OrdersController.service;
};
//# sourceMappingURL=OrdersController.js.map