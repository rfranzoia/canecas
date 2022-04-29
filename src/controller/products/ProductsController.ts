import { StatusCodes } from "http-status-codes";
import { Product } from "../../domain/products/Product";
import { paginationService } from "../../service/PaginationService";
import { productService } from "../../service/products/ProductsService";
import { evaluateResult } from "../ControllerHelper";
import { responseMessage } from "../DefaultResponseMessage";

export class ProductsController {

    async count(req, res) {
        const count = await productService.count({});
        return evaluateResult(count, res, StatusCodes.OK, async () => ({ count: count }));
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
        const { skip, limit } = await paginationService.getPagination(req.query);
        const products = await productService.list({}, skip, limit);
        return evaluateResult(products, res, StatusCodes.OK, async () => products);
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