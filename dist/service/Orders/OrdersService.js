"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const typeorm_1 = require("typeorm");
const ResponseData_1 = require("../../controller/ResponseData");
const http_status_codes_1 = require("http-status-codes");
const Orders_1 = require("../../domain/Orders/Orders");
const OrderHistoryDTO_1 = require("../../controller/Orders/OrderHistoryDTO");
const OrderDTO_1 = require("../../controller/Orders/OrderDTO");
const OrderItemDTO_1 = require("../../controller/Orders/OrderItemDTO");
const OrdersRepository_1 = require("../../domain/Orders/OrdersRepository");
class OrdersService {
    constructor() {
        this.repository = (0, typeorm_1.getRepository)(Orders_1.Orders);
    }
    async count() {
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", await OrdersRepository_1.OrdersRepository.getInstance().count());
    }
    async list(skip, limit) {
        const list = await OrdersRepository_1.OrdersRepository.getInstance().find(skip, limit);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", await Promise.all(list.map(async (order) => this.getCompleteOrder(order))));
    }
    async listByDateRange(startDate, endDate, skip, limit) {
        const list = await OrdersRepository_1.OrdersRepository.getInstance().findByDateRange(startDate, endDate, skip, limit);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", await Promise.all(list.map(async (order) => this.getCompleteOrder(order))));
    }
    async listByUserAndStatus(user_id, orderStatus, skip, limit) {
        const list = await OrdersRepository_1.OrdersRepository.getInstance().findByUserAndStatus(user_id, orderStatus, skip, limit);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", await Promise.all(list.map(async (order) => this.getCompleteOrder(order))));
    }
    async get(id) {
        const order = await OrdersRepository_1.OrdersRepository.getInstance().findById(id);
        if (!order) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");
        }
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", await this.getCompleteOrder(order));
    }
    async create(user_id, orderItems) {
        let order = await OrdersRepository_1.OrdersRepository.getInstance().createOrder(user_id);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.CREATED, "", await this.createItemsAndGetOrder(orderItems, order));
    }
    async addRemoveOrderItems(order_id, orderItems) {
        const order = await OrdersRepository_1.OrdersRepository.getInstance().findById(order_id);
        if (!order) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Nenhum pedido encontrado com o ID informado!");
        }
        else if (order.orderStatus !== "0") {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.BAD_REQUEST, "O Pedido informado não pode ser modificado!");
        }
        // delete all existing items
        await OrdersRepository_1.OrdersRepository.getInstance().deleteOrderItemsByOrderId(order.id);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", await this.createItemsAndGetOrder(orderItems, order));
    }
    async deleteOrderAndItems(id) {
        const order = await OrdersRepository_1.OrdersRepository.getInstance().findById(id);
        if (!order) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");
        }
        else if (order.orderStatus !== "0") {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.BAD_REQUEST, "O Pedido informado não pode ser excluido!");
        }
        // delete all items first
        await OrdersRepository_1.OrdersRepository.getInstance().deleteOrderItemsByOrderId(order.id);
        // delete should not be necessary since first history entry is created only after first status update
        await OrdersRepository_1.OrdersRepository.getInstance().deleteOrdersHistoryByOrderId(order.id);
        // now delete de order
        await OrdersRepository_1.OrdersRepository.getInstance().deleteOrderById(order.id);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NO_CONTENT, "Pedido removido com sucesso!");
    }
    async updateOrderStatus(id, orderStatus, changeReason) {
        const order = await OrdersRepository_1.OrdersRepository.getInstance().findById(id);
        if (!order) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");
        }
        // OrderStatus always "move" forward, never backwards
        if (Number(order.orderStatus) > Number(orderStatus)) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.BAD_REQUEST, "O novo status de pedido informado não é válido!");
        }
        // save status before change to new one
        const previous = order.orderStatus;
        const orderDate = previous === "0" ? new Date() : order.orderDate;
        await OrdersRepository_1.OrdersRepository.getInstance().updateOrderStatus(order, orderDate, orderStatus);
        // add the change to the OrdersHistory
        const history = await OrdersRepository_1.OrdersRepository.getInstance().createOrdersHistory(order, {
            order_id: order.id,
            previousStatus: previous,
            currentStatus: order.orderStatus,
            changeReason: changeReason
        });
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "Situação do Pedido atualizada com sucesso!", this.getCompleteOrder(order));
    }
    // add items to an provided order
    async createItemsAndGetOrder(orderItems, order) {
        await OrdersRepository_1.OrdersRepository.getInstance().createOrderItems(orderItems, order);
        return await this.getCompleteOrder(order);
    }
    // retrieves an order with all items and history
    async getCompleteOrder(order) {
        const orderItems = await OrdersRepository_1.OrdersRepository.getInstance().findOrderItemsByOrderId(order.id);
        const orderHistory = await OrdersRepository_1.OrdersRepository.getInstance().findOrdersHistoryByOrderId(order.id);
        return OrderDTO_1.OrderDTO.mapToDTO(order, OrderItemDTO_1.OrderItemDTO.mapToListDTO(orderItems), OrderHistoryDTO_1.OrderHistoryDTO.mapToListDTO(orderHistory));
    }
}
exports.OrdersService = OrdersService;
//# sourceMappingURL=OrdersService.js.map