import {StatusCodes} from "http-status-codes";
import {productVariationService} from "../../service/products/ProductVariationService";
import {paginationService} from "../../service/PaginationService";
import {evaluateResult} from "../ControllerHelper";
import {ProductVariation} from "../../domain/products/ProductVariation";

export class ProductVariationController {

    async count(req, res) {
        const count = await productVariationService.count({});
        return evaluateResult(count, res, StatusCodes.OK, () => ({count: count}));
    }

    async list(req, res) {
        const {skip, limit} = await paginationService.getPagination(req.query);
        const variations = await productVariationService.list(skip, limit);
        return evaluateResult(variations, res, StatusCodes.OK, () => variations);
    }

    async listByFilter(req, res) {
        const { product, drawings, background } = req.query;
        const {skip, limit} = await paginationService.getPagination(req.query);
        const variations = await productVariationService.listByFilter(product, drawings, background, skip, limit);
        return evaluateResult(variations, res, StatusCodes.OK, () => variations);
    }

    async get(req, res) {
        const { id } = req.params;
        const productVariation = await productVariationService.get(id);
        return evaluateResult(productVariation, res, StatusCodes.OK, () => productVariation);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await productVariationService.delete(id);
        return evaluateResult(result, res, StatusCodes.NO_CONTENT, () => result);
    }

    async create(req, res) {
        const { product, drawings, background, price, image } = req.body;
        const pv: ProductVariation = {
            product,
            drawings,
            background,
            price,
            image
        }
        const result = await productVariationService.create(pv);
        return evaluateResult(result, res, StatusCodes.CREATED, () => result);
    }

    async update(req, res) {
        const { id } = req.params;
        const { product, drawings, background, price, image } = req.body;
        const pv: ProductVariation = {
            product,
            drawings,
            background,
            price,
            image
        }
        const result = await productVariationService.update(id, pv);
        return evaluateResult(result, res, StatusCodes.OK, () => result);
    }

}