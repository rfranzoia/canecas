import {StatusCodes} from "http-status-codes";
import NotFoundError from "../../utils/errors/NotFoundError";
import {productTypesService} from "../../service/products/ProductTypesService";
import {evaluateResult} from "../ControllerHelper";

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
        const result = await productTypesService.create({ description: description });
        return evaluateResult(result, res, StatusCodes.CREATED, result);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await productTypesService.delete(id);
        return evaluateResult(result, res, StatusCodes.NO_CONTENT, { message: "Type deleted successfully"});
    }

    async update(req, res) {
        const { id } = req.params;
        const { description } = req.body;
        const result = await productTypesService.update(id, description);
        return evaluateResult(result, res, StatusCodes.CREATED, await productTypesService.findById(id));
    }

}