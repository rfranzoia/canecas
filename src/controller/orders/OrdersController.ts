import {StatusCodes} from "http-status-codes";
import NotFoundError from "../../utils/errors/NotFoundError";
import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import BadRequestError from "../../utils/errors/BadRequestError";
import {ordersService} from "../../service/orders/OrdersService";
import {Order} from "../../domain/orders/Orders";

export class OrdersController {

    async count(req, res) {
        return res.status(StatusCodes.OK).send({ count: await ordersService.count() });
    }

    async list(req, res) {
        return res.status(StatusCodes.OK).send(await ordersService.list());
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
        if (order instanceof InternalServerErrorError) {
            const error = order as InternalServerErrorError;
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);

        } else if (order instanceof BadRequestError) {
            const error = order as BadRequestError;
            return res.status(StatusCodes.BAD_REQUEST).send(error);
        }

        return res.status(StatusCodes.CREATED).send(order);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await ordersService.delete(id);
        if (result instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send(result as NotFoundError);

        } else if (result instanceof InternalServerErrorError) {
            const error = result as InternalServerErrorError;
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
        return res.status(StatusCodes.NO_CONTENT).send({ message: "Order deleted successfully" });
    }

    async update(req, res) {
        const { id } = req.params;
        const { status, totalPrice } = req.body;
        const order: Order = {
            status: status,
            totalPrice: totalPrice
        }
        const result = await ordersService.update(id, order);
        if (result instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send(result as NotFoundError);

        } else if (result instanceof InternalServerErrorError) {
            const error = result as InternalServerErrorError;
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);

        } else if (result instanceof BadRequestError) {
            const error = result as BadRequestError;
            return res.status(StatusCodes.BAD_REQUEST).send(error);
        }
        return res.status(StatusCodes.OK).send(await ordersService.get(id));
    }
}