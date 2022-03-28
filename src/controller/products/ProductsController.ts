import {StatusCodes} from "http-status-codes";
import BadRequestError from "../../utils/errors/BadRequestError";
import NotFoundError from "../../utils/errors/NotFoundError";
import {Product} from "../../domain/products/Product";
import {productService} from "../../service/products/ProductsService";
import {evaluateResult} from "../ControllerHelper";
import {responseMessage} from "../ResponseData";

export class ProductsController {

    async count(req, res) {
        return res.status(StatusCodes.OK).send({ count: await productService.count() });
    }

    async get(req, res) {
        const { id } = req.params;
        const product = await productService.findById(id);
        if (product instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send(product as NotFoundError);
        }
        return res.status(StatusCodes.OK).send(product);
    }

    async getByName(req, res) {
        const { name } = req.params;
        const product = await productService.findByName(name);
        if (product instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send(product as NotFoundError);
        }
        return res.status(StatusCodes.OK).send(product);
    }

    async list(req, res) {
        return res.status(StatusCodes.OK).send(await productService.list());
    }

    async listByType(req, res) {
        const { type } = req.params;
        return res.status(StatusCodes.OK).send(await productService.listByType(type));
    }

    async listByPriceRange(req, res) {
        const { startPrice, endPrice } = req.params;
        const result = await productService.listByPriceRange(startPrice, endPrice);
        if (result instanceof BadRequestError) {
            return res.status(StatusCodes.BAD_REQUEST).send(result as BadRequestError);
        }
        return res.status(StatusCodes.OK).send(result);
    }

    async create(req, res) {
        const { name, description, price, type } = req.body;
        const p: Product = {
            name: name,
            description: description,
            price: price,
            type: type
        }
        const product = await productService.create(p);
        return evaluateResult(product, res, StatusCodes.CREATED, async () => product);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await productService.delete(id);
        return evaluateResult(result, res, StatusCodes.NO_CONTENT, async () => responseMessage("Type deleted successfully"));
    }

    async update(req, res) {
        const { id } = req.params;
        const { name, description, price, type } = req.body;
        const product: Product = {
            name: name,
            description: description,
            price: price,
            type: type
        }
        const result = await productService.update(id, product);
        return evaluateResult(result, res, StatusCodes.OK, async () => await productService.findById(id));
    }

}