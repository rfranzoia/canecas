import {DefaultService} from "../DefaultService";
import {BackgroundType, ProductVariation} from "../../domain/products/ProductVariation";
import {productVariationRepository} from "../../domain/products/ProductVariationRepository";
import {productService} from "./ProductsService";
import NotFoundError from "../../utils/errors/NotFoundError";
import BadRequestError from "../../utils/errors/BadRequestError";
import BaseError from "../../utils/errors/BaseError";

class ProductVariationService extends DefaultService<ProductVariation> {

    constructor() {
        super(productVariationRepository, "Product Variation");
    }

    async listByProductDrawingsBackground(product: string, drawings: number, background: BackgroundType, skip:number, limit:number) {
        const isValid = await areParametersValid(product, drawings, background);
        if (isValid instanceof BaseError) {
            return isValid;
        }
        const filter = getFilter(product, drawings, background);
        return await this.repository.findAll(filter, skip, limit);
    }

    async create(productVariation: ProductVariation) {
        const similar = await doesVariationExist(productVariation.product, productVariation.drawings, productVariation.background);
        if (similar) {
            return similar;
        }

        return await productVariationRepository.create(productVariation)
    }

    async update(id: string, productVariation: ProductVariation) {
        const pv = await this.repository.findById(id);
        if (!pv) {
            return new NotFoundError(`${this.name} doesn't exist`);

        }
        const isValid = await areParametersValid(productVariation.product, productVariation.drawings, productVariation.background);
        if (isValid instanceof BaseError) {
            return isValid;
        }
        let filter = getFilter(productVariation.product, productVariation.drawings, productVariation.background);
        filter = {
            ...filter,
            _id: {
                $ne: id
            }
        }
        const list = await this.repository.findAll(filter, 0, 0);
        if (list && list.length > 0) {
            return new BadRequestError(`${this.name} already exist`);
        }

        return await productVariationRepository.update(id, productVariation);
    }

}

const getFilter = (product: string, drawings: number, background: BackgroundType) => {

    let f = {};
    if (product) {
        f = {
            ...f,
            product: product
        }
    }
    if (drawings) {
        f = {
            ...f,
            drawings: drawings
        }
    }
    if (background) {
        f = {
            ...f,
            background: background
        }
    }

    return f;
}

const doesVariationExist = async (product: string, drawings: number, background: BackgroundType): Promise<Boolean | BadRequestError | NotFoundError> => {
    const list = await productVariationService.listByProductDrawingsBackground(product, drawings, background, 0, 0);
    if (list instanceof BaseError) {
        return list;

    } else if (list.length > 0) {
        return new BadRequestError(`${productVariationService.name} already exist`);

    }
    return false;
}

const areParametersValid = async (product: string, drawings: number, background: BackgroundType): Promise<Boolean | BadRequestError | NotFoundError> => {
    if (product) {
        const p = await productService.findByName(product);
        if (!p || p instanceof NotFoundError) {
            return new NotFoundError("Product doesn't exist");
        }
    }

    if (drawings && drawings < 0) {
        return new BadRequestError(("Number of drawings cannot be negative"));

    } else if (background && !(background.toUpperCase() in BackgroundType)) {
        return new BadRequestError("Background type is incorrect.");
    }

    return true;
}

export const productVariationService = new ProductVariationService();