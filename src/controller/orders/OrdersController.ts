import {StatusCodes} from "http-status-codes";
import {ordersService} from "../../service/orders/OrdersService";
import {Order} from "../../domain/orders/Orders";
import {evaluateResult} from "../ControllerHelper";
import {responseMessage} from "../ResponseData";

export class OrdersController {

    async count(req, res) {
        return res.status(StatusCodes.OK).send({ count: await ordersService.count() });
    }

    async list(req, res) {
        const userEmail = req['user'].email;
        return res.status(StatusCodes.OK).send(await ordersService.list(userEmail));
    }

    async listByDateRange(req, res) {
        const {start_date, end_date} = req.params;
        const userEmail = req['user'].email;
        const orders = await ordersService.listByDateRange(start_date, end_date, userEmail);
        return evaluateResult(orders, res, StatusCodes.CREATED, () => orders);
    }

    async get(req, res) {
        const { id } = req.params;
        const userEmail = req['user'].email;
        const order = await ordersService.get(id, userEmail);
        return evaluateResult(order, res, StatusCodes.CREATED, () => order);
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
        const result = await ordersService.delete(id, userEmail);
        return evaluateResult(result, res, StatusCodes.NO_CONTENT, async () => responseMessage("Order deleted successfully" ));
    }

    async update(req, res) {
        const userEmail = req['user'].email;
        const { id } = req.params;
        const { status, totalPrice, items } = req.body;
        const order: Order = {
            status: status,
            totalPrice: totalPrice,
            items: items
        }
        const result = await ordersService.update(id, order, userEmail);
        return evaluateResult(result, res, StatusCodes.OK, async () => await ordersService.get(id, userEmail));
    }
}

