import {StatusCodes} from "http-status-codes";
import BadRequestError from "../../utils/errors/BadRequestError";
import NotFoundError from "../../utils/errors/NotFoundError";
import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import {Product} from "../../domain/products/Product";
import {productService} from "../../service/products/ProductsService";

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

    async create(req, res) {
        const { name, description, price, type } = req.body;
        const p: Product = {
            name: name,
            description: description,
            price: price,
            type: type
        }
        const product = await productService.create(p);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).send(new NotFoundError("Product was not created!"));

        } else if (product instanceof BadRequestError) {
            const error = product as BadRequestError;
            return res.status(StatusCodes.BAD_REQUEST).send(error);
        }
        return res.status(StatusCodes.CREATED).send(product);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await productService.delete(id);
        if (result instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send(result as NotFoundError);

        } else if (result instanceof InternalServerErrorError) {
            const error = result as InternalServerErrorError;
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
        return res.status(StatusCodes.NO_CONTENT).send({ message: "Type deleted successfully" });
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
        if (result instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send(result as NotFoundError);

        } else if (result instanceof InternalServerErrorError) {
            const error = result as InternalServerErrorError;
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);

        } else if (result instanceof BadRequestError) {
            const error = result as BadRequestError;
            return res.status(StatusCodes.BAD_REQUEST).send(error);
        }
        return res.status(StatusCodes.OK).send(await productService.findById(id));
    }

}