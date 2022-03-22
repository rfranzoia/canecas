import {ResponseData} from "../../controller/ResponseData";
import {StatusCodes} from "http-status-codes";
import {ProductPriceDTO} from "../../controller/Products/ProductPriceDTO";
import {ProductPricesRepository} from "../../domain/Products/ProductPricesRepository";

export class ProductPricesService {

    async count(pageSize:number):(Promise<ResponseData>) {
        return new ResponseData(StatusCodes.OK, "", ProductPricesRepository.getInstance().count(pageSize));
    }

    async list(skip:number, limit:number):(Promise<ResponseData>) {
        const list = await ProductPricesRepository.getInstance().find(skip, limit);
        return new ResponseData(StatusCodes.OK, "", ProductPriceDTO.mapToListDTO(list));
    }

    async listByProduct(product_id: number, skip:number, limit:number): Promise<ResponseData> {
        const list = await ProductPricesRepository.getInstance().findByProduct(product_id, skip, limit);
        return new ResponseData(StatusCodes.OK, "", ProductPriceDTO.mapToListDTO(list));
    }

    async listDistinctProductTypePrices(product_type_id: number, skip:number, limit:number): Promise<ResponseData> {
        const list = await ProductPricesRepository.getInstance().findDistinctProductTypePrices(product_type_id, skip, limit);
        return new ResponseData(StatusCodes.OK, "", ProductPriceDTO.mapToListDTO(list));
    }

    async create({product_id, price, validUntil}: ProductPriceRequest): Promise<ResponseData> {
        const ppr = {
            product_id: Number(product_id),
            price: Number(price),
            validUntil: new Date(validUntil)
        }
        const productPrice = await ProductPricesRepository.getInstance().findById((await ProductPricesRepository.getInstance().create(ppr)).id);
        return new ResponseData(StatusCodes.OK, "Prices added", ProductPriceDTO.mapToDTO(productPrice));
    }

    async delete(id: number): Promise<ResponseData> {
        const productPrice = await ProductPricesRepository.getInstance().findById(id);
        if (!productPrice) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Preço de Produto com Id informado não existe!");
        }
        await ProductPricesRepository.getInstance().delete(id);
        return new ResponseData(StatusCodes.NO_CONTENT, "Preço de Produto removido com Sucesso!");
    }

    async deleteByProduct(productId: number): Promise<ResponseData> {
        const prices = await ProductPricesRepository.getInstance().findByProduct(productId, 0, 0);
        if (!prices) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Não existem preços cadastrados para o Produto informado!");
        }
        await ProductPricesRepository.getInstance().deleteByProduct(productId);
        return new ResponseData(StatusCodes.NO_CONTENT, "Os Preços do Produto informado foram removido com Sucesso!");
    }
}

export interface ProductPriceRequest {
    product_id: number;
    price: number;
    validUntil: Date;
}