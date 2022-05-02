import { BackgroundType, ProductVariation } from "../domain/ProductVariation";
import { productVariationRepository } from "../repository/ProductVariationRepository";
import BadRequestError from "../utils/errors/BadRequestError";
import BaseError from "../utils/errors/BaseError";
import NotFoundError from "../utils/errors/NotFoundError";
import logger from "../utils/Logger";
import { DefaultService } from "./DefaultService";
import { productService } from "./ProductsService";

class ProductVariationService extends DefaultService<ProductVariation> {

    constructor() {
        super(productVariationRepository, "Product Variation");
    }

    async list(skip: number, limit: number) {
        try {
            return await productVariationRepository.findAllSorted({}, skip, limit);
        } catch (error) {
            return error;
        }
    }

    async listByFilter(product: string, caricatures: number, background: BackgroundType, skip: number, limit: number) {
        const isValid = await areParametersValid(product, caricatures, background);
        if (isValid instanceof BaseError) {
            return isValid;
        }
        const filter = getFilter(product, caricatures, background);
        return await productVariationRepository.findAllSorted(filter, skip, limit);
    }

    async create(productVariation: ProductVariation) {
        const similar = await doesVariationExist(productVariation.product, productVariation.caricatures, productVariation.background);
        if (similar) {
            return similar;
        }

        return await productVariationRepository.create(productVariation)
    }

    async update(id: string, productVariation: ProductVariation) {
        if (!id) {
            logger.error("Invalid ID", id);
            return new BadRequestError(`Provided ID for ${this.name} is not valid`);
        }
        const pv = await this.repository.findById(id);
        if (!pv) {
            return new NotFoundError(`${this.name} doesn't exist`);

        }
        const isValid = await areParametersValid(productVariation.product, productVariation.caricatures, productVariation.background);
        if (isValid instanceof BaseError) {
            return isValid;
        }

        /*
        let filter = getFilter(productVariation.product, productVariation.caricatures, productVariation.background);
        filter = {
            ...filter,
            id: {
                $ne: id
            }
        }
        const list = await this.repository.findAll(filter, 0, 0);
        if (list && list.length > 0) {
            return new BadRequestError(`${this.name} already exist`);
        }
         */

        return await productVariationRepository.update(id, productVariation);
    }

}

const getFilter = (product: string, caricatures: number, background: BackgroundType) => {

    let filter = {};
    if (product) filter = { product: product }
    if (caricatures) filter = { ...filter, caricatures: caricatures }
    if (background) filter = { ...filter, background: background }

    return filter;
}

const doesVariationExist = async (product: string, caricatures: number, background: BackgroundType): Promise<Boolean | BadRequestError | NotFoundError> => {
    const list = await productVariationService.listByFilter(product, caricatures, background, 0, 0);
    if (list instanceof BaseError) {
        return list;

    } else if (list.length > 0) {
        return new BadRequestError(`${productVariationService.name} already exist`);

    }
    return false;
}

const areParametersValid = async (product: string, caricatures: number, background: BackgroundType): Promise<Boolean | BadRequestError | NotFoundError> => {
    if (product) {
        const p = await productService.findByName(product);
        if (!p || p instanceof NotFoundError) {
            return new NotFoundError("Product doesn't exist");
        }
    }

    if (caricatures && caricatures < 0) {
        return new BadRequestError(("Number of caricatures cannot be negative"));

    } else if (background && !(background in BackgroundType)) {
        return new BadRequestError("Background type is incorrect.");
    }

    return true;
}

export const productVariationService = new ProductVariationService();