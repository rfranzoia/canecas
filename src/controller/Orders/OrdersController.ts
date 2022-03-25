import {Request, Response} from "express";
import {OrdersService} from "../../service/Orders/OrdersService";
import {PaginationService} from "../../service/PaginationService";
import {StatusCodes} from "http-status-codes";
import {ResponseData} from "../ResponseData";
import NotFoundError from "../../utils/errors/NotFoundError";
import InternalServerError from "../../utils/errors/InternalServerError";
import BadRequestError from "../../utils/errors/BadRequestError";
import {OrderDTO} from "./OrderDTO";

export class OrdersController {

    static service: OrdersService;

    static getService = () => {
        if (!this.service) {
            OrdersController.service = new OrdersService();
        }
        return OrdersController.service;
    }

    async count(request: Request, response: Response) {
        const result = await OrdersController.getService().count();
        return response.status(StatusCodes.OK).send({ count: result});
    }

    async list(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const userId = Number(request["user"].id);
        try {
            const result = await OrdersController.getService().list(skip, limit, userId);
            return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
        } catch (error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new ResponseData(StatusCodes.INTERNAL_SERVER_ERROR, error.message, error));
        }
    }

    async listByDateRange(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const {start_date, end_date} = request.params;
        const userId = Number(request["user"].id);
        try {
            const result = await OrdersController.getService().listByDateRange(new Date(start_date), new Date(end_date), skip, limit, userId);
            return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
        } catch (error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new ResponseData(StatusCodes.INTERNAL_SERVER_ERROR, error.message, error));
        }
    }

    async listByStatus(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const {order_status} = request.params;
        const userId = Number(request["user"].id);
        try {
            const result = await OrdersController.getService().listByStatus(order_status, skip, limit, userId);
            return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
        } catch (error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new ResponseData(StatusCodes.INTERNAL_SERVER_ERROR, error.message, error));
        }
    }

    async listOrderHistoryByOrderId(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const { id } = request.params;
        const userId = Number(request["user"].id);
        try {
            const result = await OrdersController.getService().listOrderHistoryByOrderId(id, skip, limit, userId);
            return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
        } catch (error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new ResponseData(StatusCodes.INTERNAL_SERVER_ERROR, error.message, error));
        }
    }

    async get(request: Request, response: Response) {
        const { id } = request.params;
        const userId = Number(request["user"].id);
        try {
            const result = await OrdersController.getService().get(id, userId);
            if (result instanceof NotFoundError) {
                return response.status(StatusCodes.NOT_FOUND).send(new ResponseData(StatusCodes.NOT_FOUND, "", result))
            }
            return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
        } catch (error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new ResponseData(StatusCodes.INTERNAL_SERVER_ERROR, error.message, error));
        }
    }

    async create(request: Request, response: Response) {
        const { user_id, orderItems } = request.body;
        const result = await OrdersController.getService().create(user_id, orderItems);
        if (result instanceof InternalServerError) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new ResponseData(StatusCodes.INTERNAL_SERVER_ERROR, "", result))
        }
        return response.status(StatusCodes.CREATED).send(new ResponseData(StatusCodes.CREATED, "", result));
    }

    async addRemoveOrderItems(request: Request, response: Response) {
        const { id } = request.params;
        const { orderItems } = request.body;
        const result = await OrdersController.getService().addRemoveOrderItems(id, orderItems);
        return processResult(result, response, StatusCodes.OK, new ResponseData(StatusCodes.OK, "", result));
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const result = await OrdersController.getService().deleteOrderAndItems(id);
        return processResult(result, response, StatusCodes.NO_CONTENT, new ResponseData(StatusCodes.NO_CONTENT, "Pedido removido com sucesso"));
    }

    async updateStatus(request: Request, response: Response) {
        const { id } = request.params;
        const { orderStatus, changeReason } = request.body;
        const userId = Number(request["user"].id);
        const result = await OrdersController.getService().updateOrderStatus(id, orderStatus, changeReason, userId);
        return processResult(result, response, StatusCodes.OK, new ResponseData(StatusCodes.OK, "Status do pedido atualizado com sucesso", result))
    }
}

const processResult = (result: void | OrderDTO | BadRequestError | NotFoundError | InternalServerError,
                       response: Response,
                       statusCode: number,
                       responseData: ResponseData) => {
    if (result instanceof BadRequestError) {
        return response.status(StatusCodes.BAD_REQUEST).send(new ResponseData(StatusCodes.BAD_REQUEST, "", result));
    } else if (result instanceof NotFoundError) {
        return response.status(StatusCodes.NOT_FOUND).send(new ResponseData(StatusCodes.NOT_FOUND, "", result));

    } else if (result instanceof InternalServerError) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new ResponseData(StatusCodes.INTERNAL_SERVER_ERROR, "", result));
    }
    return response.status(statusCode).send(responseData);
}