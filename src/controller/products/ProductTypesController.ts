import {StatusCodes} from "http-status-codes";
import {productTypesService} from "../../service/products/ProductTypesService";
import {evaluateResult} from "../ControllerHelper";
import {responseMessage} from "../ResponseData";

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
        return evaluateResult(pt, res, StatusCodes.OK, async () => pt);
    }

    async findByDescription(req, res) {
        const { description } = req.params;
        const pt = await productTypesService.findByDescription(description);
        return evaluateResult(pt, res, StatusCodes.OK, async () => pt);
    }

    async create(req, res) {
        const { description, image } = req.body;
        const result = await productTypesService.create({ description: description, image: image });
        return evaluateResult(result, res, StatusCodes.CREATED, async () => result);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await productTypesService.delete(id);
        return evaluateResult(result, res, StatusCodes.NO_CONTENT, async () => responseMessage("Type deleted successfully"));
    }

    async update(req, res) {
        const { id } = req.params;
        const { description, image } = req.body;
        const result = await productTypesService.update(id, description, image);
        return evaluateResult(result, res, StatusCodes.CREATED, async () => await productTypesService.findById(id));
    }

}