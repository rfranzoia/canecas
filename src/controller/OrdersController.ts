import {Request, Response} from "express";
import {OrdersService} from "../service/OrdersService";

const DEFAULT_PAGE_SIZE = 20;

export class OrdersController {

    static service: OrdersService;

    static getService = () => {
        if (!this.service) {
            OrdersController.service = new OrdersService();
        }
        return OrdersController.service;
    }

    async count(request: Request, response: Response) {
        const {pageSize} = request.query;
        const result = await OrdersController.getService().count(Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }

    async list(request: Request, response: Response) {
        const {pageNumber, pageSize} = request.query;
        const result = await OrdersController.getService().list(Number(pageNumber || 0), Number(pageSize || DEFAULT_PAGE_SIZE));
        response.status(result.statusCode).send(result);
    }

    async get(request: Request, response: Response) {
        const { id } = request.params;
        const result = await OrdersController.getService().get(id);
        response.status(result.statusCode).send(result);
    }

    async create(request: Request, response: Response) {
        const { user } = request.body;
        const result = await OrdersController.getService().create(user);
        response.status(result.statusCode).send(result);
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const result = await OrdersController.getService().delete(id);
        response.status(result.statusCode).send(result);
    }
}