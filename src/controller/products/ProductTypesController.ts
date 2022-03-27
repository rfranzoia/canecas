import {StatusCodes} from "http-status-codes";
import BadRequestError from "../../utils/errors/BadRequestError";
import NotFoundError from "../../utils/errors/NotFoundError";
import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import {productTypesService} from "../../service/products/ProductTypesService";

export class ProductTypesController {

    async count(req, res) {
        return res.status(StatusCodes.OK).send({ count: await productTypesService.count() });
    }

    async list(req, res) {
        return res.status(StatusCodes.OK).send(await productTypesService.list());
    }

    async get(req, res) {
        const { id } = req.params;
        const pt = await productTypesService.findById(id);
        if (pt instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send("Type not found");
        }
        return res.status(StatusCodes.OK).send(pt);
    }

    async findByDescription(req, res) {
        const { description } = req.params;
        const pt = await productTypesService.findByDescription(description);
        if (pt instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send("Type not found!");
        }
        return res.status(StatusCodes.OK).send(pt);
    }

    async create(req, res) {
        const { description } = req.body;
        const pt = await productTypesService.create({ description: description });
        if (!pt) {
            return res.status(StatusCodes.NOT_FOUND).send("Type was not created!");

        } else if (pt instanceof BadRequestError) {
            const error = pt as BadRequestError;
            return res.status(StatusCodes.BAD_REQUEST).send(error);
        }
        return res.status(StatusCodes.CREATED).send(pt);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await productTypesService.delete(id);
        if (result instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send("Type not found!");

        } else if (result instanceof InternalServerErrorError) {
            const error = result as InternalServerErrorError;
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "Error while deleting the type", error: error });
        }
        return res.status(StatusCodes.NO_CONTENT).send({ message: "Type deleted successfully" });
    }

    async update(req, res) {
        const { id } = req.params;
        const { description } = req.body;
        const result = await productTypesService.update(id, description);
        if (result instanceof NotFoundError) {
            return res.status(StatusCodes.NOT_FOUND).send("Type not found!");

        } else if (result instanceof InternalServerErrorError) {
            const error = result as InternalServerErrorError;
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "Error while deleting the type", error: error });

        } else if (result instanceof BadRequestError) {
            const error = result as BadRequestError;
            return res.status(StatusCodes.BAD_REQUEST).send(error);
        }
        return res.status(StatusCodes.OK).send(await productTypesService.findById(id));
    }

}