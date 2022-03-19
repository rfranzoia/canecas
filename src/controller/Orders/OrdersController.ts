import {Request, Response} from "express";
import {OrdersService} from "../../service/Orders/OrdersService";
import {PaginationService} from "../../service/PaginationService";

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
        response.status(result.statusCode).send(result);
    }

    async list(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const result = await OrdersController.getService().list(skip, limit);
        response.status(result.statusCode).send(result);
    }

    async listByDateRange(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const {start_date, end_date} = request.params;
        const result = await OrdersController.getService().listByDateRange(new Date(start_date), new Date(end_date), skip, limit);
        response.status(result.statusCode).send(result);
    }

    async listByUserAndStatus(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const {user_id, order_status} = request.params;
        const result = await OrdersController.getService().listByUserAndStatus(Number(user_id), order_status, skip, limit);
        response.status(result.statusCode).send(result);
    }

    async get(request: Request, response: Response) {
        const { id } = request.params;
        const result = await OrdersController.getService().get(id);
        response.status(result.statusCode).send(result);
    }

    async create(request: Request, response: Response) {
        const { user_id, orderItems } = request.body;
        const result = await OrdersController.getService().create(user_id, orderItems);
        response.status(result.statusCode).send(result);
    }

    async addRemoveOrderItems(request: Request, response: Response) {
        const { id } = request.params;
        const { orderItems } = request.body;
        const result = await OrdersController.getService().addRemoveOrderItems(id, orderItems);
        response.status(result.statusCode).send(result);
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const result = await OrdersController.getService().deleteOrderAndItems(id);
        response.status(result.statusCode).send(result);
    }

    async updateStatus(request: Request, response: Response) {
        const { id } = request.params;
        const { orderStatus, changeReason } = request.body;
        const result = await OrdersController.getService().updateOrderStatus(id, orderStatus, changeReason);
        response.status(result.statusCode).send(result);
    }
}