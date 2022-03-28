import {StatusCodes} from "http-status-codes";
import NotFoundError from "../../utils/errors/NotFoundError";
import BadRequestError from "../../utils/errors/BadRequestError";
import {ordersService} from "../../service/orders/OrdersService";
import {Order} from "../../domain/orders/Orders";
import {evaluateResult} from "../ControllerHelper";

export class OrdersController {

    async count(req, res) {
        return res.status(StatusCodes.OK).send({ count: await ordersService.count() });
    }

    async list(req, res) {
        return res.status(StatusCodes.OK).send(await ordersService.list());
    }

    async listByDateRange(req, res) {
        const {start_date, end_date} = req.params;
        const result = await ordersService.listByDateRange(start_date, end_date);
        if (result instanceof BadRequestError) {
            return res.status(StatusCodes.BAD_REQUEST).send(result as BadRequestError);
        }
        return res.status(StatusCodes.OK).send(result);
    }

    async get(req, res) {
        const { id } = req.params;
        const order = await ordersService.get(id);
        if (order instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send(order as NotFoundError);
        }
        return res.status(StatusCodes.OK).send(order);
    }

    async create(req, res) {
        const { orderDate, userEmail, items } = req.body;
        const o: Order = {
            orderDate: orderDate,
            userEmail: userEmail,
            items: items
        }
        const order = await ordersService.create(o);
        return evaluateResult(order, res, StatusCodes.CREATED, order);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await ordersService.delete(id);
        return evaluateResult(result, res, StatusCodes.NO_CONTENT, { message: "Order deleted successfully" })
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
        return evaluateResult(result, res, StatusCodes.OK, await ordersService.get(id));
    }
}

