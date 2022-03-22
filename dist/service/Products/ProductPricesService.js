"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPricesService = void 0;
const ResponseData_1 = require("../../controller/ResponseData");
const http_status_codes_1 = require("http-status-codes");
const ProductPriceDTO_1 = require("../../controller/Products/ProductPriceDTO");
const ProductPricesRepository_1 = require("../../domain/Products/ProductPricesRepository");
class ProductPricesService {
    async count(pageSize) {
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", ProductPricesRepository_1.ProductPricesRepository.getInstance().count(pageSize));
    }
    async list(skip, limit) {
        const list = await ProductPricesRepository_1.ProductPricesRepository.getInstance().find(skip, limit);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", ProductPriceDTO_1.ProductPriceDTO.mapToListDTO(list));
    }
    async listByProduct(product_id, skip, limit) {
        const list = await ProductPricesRepository_1.ProductPricesRepository.getInstance().findByProduct(product_id, skip, limit);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", ProductPriceDTO_1.ProductPriceDTO.mapToListDTO(list));
    }
    async listDistinctProductTypePrices(product_type_id, skip, limit) {
        const list = await ProductPricesRepository_1.ProductPricesRepository.getInstance().findDistinctProductTypePrices(product_type_id, skip, limit);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", ProductPriceDTO_1.ProductPriceDTO.mapToListDTO(list));
    }
    // TODO: include additional validation (check if valid price for product already exists)
    async create({ product_id, price, validFrom, validTo }) {
        const ppr = {
            product_id: Number(product_id),
            price: Number(price),
            validFrom: new Date(validFrom),
            validTo: new Date(validTo)
        };
        const productPrice = await ProductPricesRepository_1.ProductPricesRepository.getInstance().findById((await ProductPricesRepository_1.ProductPricesRepository.getInstance().create(ppr)).id);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "Prices added", ProductPriceDTO_1.ProductPriceDTO.mapToDTO(productPrice));
    }
    // TODO: include additional validation (check if valid price for product already exists)
    async createAll(data) {
        let prices = [];
        for (let i = 0; i < data.length; i++) {
            const ppr = {
                product_id: Number(data[i].product_id),
                price: Number(data[i].price),
                validFrom: new Date(data[i].validFrom),
                validTo: new Date(data[i].validTo)
            };
            const productPrice = await this.create(ppr);
            if (productPrice) {
                prices.push(productPrice.data);
            }
        }
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "Prices added", ProductPriceDTO_1.ProductPriceDTO.mapToListDTO(prices));
    }
    async delete(id) {
        const productPrice = await ProductPricesRepository_1.ProductPricesRepository.getInstance().findById(id);
        if (!productPrice) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Preço de Produto com Id informado não existe!");
        }
        await ProductPricesRepository_1.ProductPricesRepository.getInstance().delete(id);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NO_CONTENT, "Preço de Produto removido com Sucesso!");
    }
    async deleteByProduct(productId) {
        const prices = await ProductPricesRepository_1.ProductPricesRepository.getInstance().findByProduct(productId, 0, 0);
        if (!prices) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Não existem preços cadastrados para o Produto informado!");
        }
        await ProductPricesRepository_1.ProductPricesRepository.getInstance().deleteByProduct(productId);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NO_CONTENT, "Os Preços do Produto informado foram removido com Sucesso!");
    }
}
exports.ProductPricesService = ProductPricesService;
//# sourceMappingURL=ProductPricesService.js.map