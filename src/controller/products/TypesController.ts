import {StatusCodes} from "http-status-codes";
import {typesService} from "../../service/products/TypesService";
import {evaluateResult} from "../ControllerHelper";
import {responseMessage} from "../ResponseData";

export class TypesController {

    async count(req, res) {
        return res.status(StatusCodes.OK).send({ count: await typesService.count() });
    }

    async list(req, res) {
        return res.status(StatusCodes.OK).send(await typesService.list());
    }

    async get(req, res) {
        const { id } = req.params;
        const pt = await typesService.findById(id);
        return evaluateResult(pt, res, StatusCodes.OK, async () => pt);
    }

    async findByDescription(req, res) {
        const { description } = req.params;
        const pt = await typesService.findByDescription(description);
        return evaluateResult(pt, res, StatusCodes.OK, async () => pt);
    }

    async create(req, res) {
        const { description, image } = req.body;
        const result = await typesService.create({ description: description, image: image });
        return evaluateResult(result, res, StatusCodes.CREATED, async () => result);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await typesService.delete(id);
        return evaluateResult(result, res, StatusCodes.NO_CONTENT, async () => responseMessage("Type deleted successfully"));
    }

    async update(req, res) {
        const { id } = req.params;
        const { description, image } = req.body;
        const result = await typesService.update(id, description, image);
        return evaluateResult(result, res, StatusCodes.CREATED, async () => await typesService.findById(id));
    }

}