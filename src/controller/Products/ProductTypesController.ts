import {Request, Response} from "express";
import {ProductTypesService} from "../../service/Products/ProductTypesService";
import {PaginationService} from "../../service/PaginationService";
import {StatusCodes} from "http-status-codes";
import {ResponseData} from "../ResponseData";
import NotFoundError from "../../utils/errors/NotFoundError";
import BadRequestError from "../../utils/errors/BadRequestError";
import InternalServerError from "../../utils/errors/InternalServerError";

export class ProductTypesController {

    static service: ProductTypesService;

    static getService = () => {
        if (!this.service) {
            ProductTypesController.service = new ProductTypesService();
        }
        return ProductTypesController.service;
    }

    async count(request: Request, response: Response) {
        const result = await ProductTypesController.getService().count();
        response.status(StatusCodes.OK).send({ count: result });
    }

    async list(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query)
        const result = await ProductTypesController.getService().list(skip, limit);
        response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
    }

    async get(request: Request, response: Response) {
        const { id } = request.params;
        const result = await ProductTypesController.getService().get(Number(id));
        if (result instanceof NotFoundError) {
            return response.status(StatusCodes.NOT_FOUND).send(new ResponseData(StatusCodes.NOT_FOUND, "", result));
        }
        return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
    }


    async getByDescription(request: Request, response: Response) {
        const { description } = request.params;
        const result = await ProductTypesController.getService().getByDescription(description);
        if (result instanceof NotFoundError) {
            return response.status(StatusCodes.NOT_FOUND).send(new ResponseData(StatusCodes.NOT_FOUND, "", result));
        }
        return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
    }

    async create(request: Request, response: Response) {
        const { description, image } = request.body;
        const result = await ProductTypesController.getService().create({description, image});
        if (result instanceof BadRequestError) {
            return response.status(StatusCodes.BAD_REQUEST).send(new ResponseData(StatusCodes.BAD_REQUEST, "", result));

        } else if (result instanceof InternalServerError) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new ResponseData(StatusCodes.INTERNAL_SERVER_ERROR, "", result));
        }
        return response.status(StatusCodes.CREATED).send(new ResponseData(StatusCodes.CREATED, "", result));
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const result = await ProductTypesController.getService().delete(Number(id));
        if (result instanceof NotFoundError) {
            return response.status(StatusCodes.NOT_FOUND).send(new ResponseData(StatusCodes.NOT_FOUND, "", result));
        }
        return response.status(StatusCodes.NO_CONTENT).send(new ResponseData(StatusCodes.NO_CONTENT, ""));

    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { description, image } = request.body;
        const result = await ProductTypesController.getService().update(Number(id), {description, image});
        if (result instanceof NotFoundError) {
            return response.status(StatusCodes.NOT_FOUND).send(new ResponseData(StatusCodes.NOT_FOUND, "", result));

        } else if (result instanceof InternalServerError) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new ResponseData(StatusCodes.INTERNAL_SERVER_ERROR, "", result));
        }
        return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
    }

}