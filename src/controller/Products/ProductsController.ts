import {Request, Response} from "express";
import {ProductsService} from "../../service/Products/ProductsService";
import {PaginationService} from "../../service/PaginationService";
import BadRequestError from "../../utils/errors/BadRequestError";
import NotFoundError from "../../utils/errors/NotFoundError";
import InternalServerError from "../../utils/errors/InternalServerError";
import {StatusCodes} from "http-status-codes";
import {ResponseData} from "../ResponseData";
import {ProductDTO} from "./ProductDTO";

export class ProductsController {

    static service: ProductsService;

    static getService = () => {
        if (!this.service) {
            ProductsController.service = new ProductsService();
        }
        return ProductsController.service;
    }

    async count(request: Request, response: Response) {
        const result = await ProductsController.getService().count();
        response.status(StatusCodes.OK).send({ count: result });
    }

    async list(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const result = await ProductsController.getService().list(skip, limit);
        return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
    }

    async listByType(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const { product_type_id } = request.params;
        const result = await ProductsController.getService().listByProductType(Number(product_type_id), skip, limit);
        return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
    }

    async listByPriceRange(request: Request, response: Response) {
        const {skip, limit} = await PaginationService.getInstance().getPagination(request.query);
        const { startPrice, endPrice } = request.params;
        const result = await ProductsController.getService().listByPriceRange(Number(startPrice), Number(endPrice), skip, limit);
        return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
    }

    async get(request: Request, response: Response) {
        const {id} = request.params;
        const result = await ProductsController.getService().get(Number(id));
        if (result instanceof NotFoundError) {
            return response.status(StatusCodes.NOT_FOUND).send(new ResponseData(StatusCodes.NOT_FOUND, "", result));
        }
        return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
    }

    async getByName(request: Request, response: Response) {
        const {name} = request.params;
        const result = await ProductsController.getService().getByName(name);
        if (result instanceof NotFoundError) {
            return response.status(StatusCodes.NOT_FOUND).send(new ResponseData(StatusCodes.NOT_FOUND, "", result));
        }
        return response.status(StatusCodes.OK).send(new ResponseData(StatusCodes.OK, "", result));
    }

    async create(request: Request, response: Response) {
        const {name, description, product_type_id, image, price} = request.body;

        const result = await ProductsController.getService()
            .create({ name,
                description,
                product_type_id,
                image,
                price});

        return processResult(StatusCodes.CREATED, result, response);
    }

    async delete(request: Request, response: Response) {
        const {id} = request.params;
        const result = await ProductsController.getService().delete(Number(id));
        if (result instanceof NotFoundError) {
            return response.status(StatusCodes.NOT_FOUND).send(new ResponseData(StatusCodes.NOT_FOUND, "", result));
        }
        return response.status(StatusCodes.NO_CONTENT).send(new ResponseData(StatusCodes.NO_CONTENT, "Produto removido com sucesso"));
    }

    async update(request: Request, response: Response) {
        const {id} = request.params;
        const {name, description, product_type_id, image, price} = request.body;
        const result = await ProductsController.getService().update(Number(id), {name, description, product_type_id, image, price});

        return processResult(StatusCodes.OK, result, response);
    }

}

function processResult(statusCode: number, result: ProductDTO | NotFoundError | BadRequestError | InternalServerError, response: Response) {
    if (result instanceof BadRequestError) {
        return response.status(StatusCodes.BAD_REQUEST).send(new ResponseData(StatusCodes.BAD_REQUEST, result.message, result));

    } else if (result instanceof NotFoundError) {
        return response.status(StatusCodes.NOT_FOUND).send(new ResponseData(StatusCodes.NOT_FOUND, result.message, result));

    } else if (result instanceof InternalServerError) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new ResponseData(StatusCodes.INTERNAL_SERVER_ERROR, result.message, result));

    }
    return response.status(statusCode).send(new ResponseData(statusCode, "", result));
}