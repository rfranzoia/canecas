import {StatusCodes} from "http-status-codes";
import {Product} from "../../domain/products/Product";
import {productService} from "../../service/products/ProductsService";
import {evaluateResult} from "../ControllerHelper";
import {responseMessage} from "../ResponseData";
import {paginationService} from "../../service/PaginationService";

export class ProductsController {

    async count(req, res) {
        return res.status(StatusCodes.OK).send({ count: await productService.count({}) });
    }

    async get(req, res) {
        const { id } = req.params;
        const product = await productService.get(id);
        return evaluateResult(product, res, StatusCodes.OK, async () => product);
    }

    async getByName(req, res) {
        const { name } = req.params;
        const product = await productService.findByName(name);
        return evaluateResult(product, res, StatusCodes.OK, async () => product);
    }

    async list(req, res) {
        const {skip, limit} = await paginationService.getPagination(req.query);
        return res.status(StatusCodes.OK).send(await productService.list({}, skip, limit));
    }

    async create(req, res) {
        const { name, description, price, image } = req.body;
        const p: Product = {
            name: name,
            description: description,
            price: price,
            image: image
        }
        const product = await productService.create(p);
        return evaluateResult(product, res, StatusCodes.CREATED, async () => product);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await productService.delete(id);
        return evaluateResult(result, res, StatusCodes.NO_CONTENT, async () => responseMessage("Product deleted successfully"));
    }

    async update(req, res) {
        const { id } = req.params;
        const { name, description, price, image } = req.body;
        const product: Product = {
            name: name,
            description: description,
            price: price,
            image: image
        }
        const result = await productService.update(id, product);
        return evaluateResult(result, res, StatusCodes.OK, async () => await productService.get(id));
    }

}