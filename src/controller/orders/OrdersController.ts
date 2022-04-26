import {StatusCodes} from "http-status-codes";
import {ordersService} from "../../service/orders/OrdersService";
import {Order} from "../../domain/orders/Orders";
import {evaluateResult} from "../ControllerHelper";
import {responseMessage} from "../DefaultResponseMessage";
import {paginationService} from "../../service/PaginationService";

export class OrdersController {

    async count(req, res) {
        const requestUserEmail = req['user'].email;
        const {startDate, endDate, orderStatus, userEmail} = req.query;
        const count = await ordersService.count({startDate, endDate, orderStatus, userEmail, requestUserEmail});
        return evaluateResult(count, res, StatusCodes.OK, () => ({count: count}));
    }

    async list(req, res) {
        const userEmail = req['user'].email;
        const {skip, limit} = await paginationService.getPagination(req.query);
        const orders = await ordersService.list(userEmail, skip, limit);
        return evaluateResult(orders, res, StatusCodes.OK, () => orders);
    }

    async listByFilter(req, res) {
        const requestUserEmail = req['user'].email;
        const {startDate, endDate, orderStatus, userEmail} = req.query;
        const {skip, limit} = await paginationService.getPagination(req.query);
        const orders = await ordersService.listByFilter(startDate, endDate, orderStatus, userEmail, requestUserEmail, skip, limit);
        return evaluateResult(orders, res, StatusCodes.OK, () => orders);
    }

    async get(req, res) {
        const { id } = req.params;
        const userEmail = req['user'].email;
        const order = await ordersService.getAsUser(id, userEmail);
        return evaluateResult(order, res, StatusCodes.OK, () => order);
    }

    async create(req, res) {
        const { orderDate, userEmail, items } = req.body;
        const o: Order = {
            orderDate: orderDate,
            userEmail: userEmail,
            items: items
        }
        const order = await ordersService.create(o);
        return evaluateResult(order, res, StatusCodes.CREATED, () => order);
    }

    async delete(req, res) {
        const { id } = req.params;
        const userEmail = req['user'].email;
        const result = await ordersService.deleteAsUser(id, userEmail);
        return evaluateResult(result, res, StatusCodes.NO_CONTENT, async () => responseMessage("Order deleted successfully" ));
    }

    async update(req, res) {
        const reqUserEmail = req['user'].email;
        const { id } = req.params;
        const { orderDate, userEmail, status, statusReason, totalPrice, items } = req.body;
        const order: Order = {
            orderDate: orderDate,
            userEmail: userEmail,
            status: status,
            statusReason: statusReason,
            totalPrice: totalPrice,
            items: items
        }
        const result = await ordersService.update(id, order, reqUserEmail);
        return evaluateResult(result, res, StatusCodes.OK, async () => await ordersService.getAsUser(id, reqUserEmail));
    }
}

