"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTypesService = void 0;
const ResponseData_1 = require("../../controller/ResponseData");
const http_status_codes_1 = require("http-status-codes");
const ProductTypeDTO_1 = require("../../controller/Products/ProductTypeDTO");
const ProductTypeRepository_1 = require("../../domain/Products/ProductTypeRepository");
class ProductTypesService {
    async count() {
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", await ProductTypeRepository_1.ProductTypesRepository.getInstance().count());
    }
    async list(skip, limit) {
        const list = await ProductTypeRepository_1.ProductTypesRepository.getInstance().find(skip, limit);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", ProductTypeDTO_1.ProductTypeDTO.mapToListDTO(list));
    }
    async listProductTypesWithMinPricesAvailable(skip, limit) {
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", await ProductTypeRepository_1.ProductTypesRepository.getInstance().findProductTypesWithMinPrices(skip, limit));
    }
    async get(id) {
        const productType = await ProductTypeRepository_1.ProductTypesRepository.getInstance().findById(id);
        if (!productType) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Tipo de Produto não existe!");
        }
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", ProductTypeDTO_1.ProductTypeDTO.mapToDTO(productType));
    }
    async create({ description, image }) {
        if (await ProductTypeRepository_1.ProductTypesRepository.getInstance().findByDescription(description)) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.BAD_REQUEST, "Tipo de Produto já existe!");
        }
        const productType = await ProductTypeRepository_1.ProductTypesRepository.getInstance().findById((await ProductTypeRepository_1.ProductTypesRepository.getInstance().create({ description, image })).id);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.CREATED, "", ProductTypeDTO_1.ProductTypeDTO.mapToDTO(productType));
    }
    async delete(id) {
        const productType = await ProductTypeRepository_1.ProductTypesRepository.getInstance().findById(id);
        if (!productType) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Tipo de Produto não existe!");
        }
        await ProductTypeRepository_1.ProductTypesRepository.getInstance().delete(productType.id);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NO_CONTENT, "Tipo de Produto removido com Sucesso!");
    }
    async update(id, { description, image }) {
        let productType = await ProductTypeRepository_1.ProductTypesRepository.getInstance().findById(id);
        if (!productType) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Tipo de Produto não existe!");
        }
        if (await ProductTypeRepository_1.ProductTypesRepository.getInstance().findByDescription(description)) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.BAD_REQUEST, "Tipo de Produto já existe!");
        }
        productType = await ProductTypeRepository_1.ProductTypesRepository.getInstance().update(id, { description, image });
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "Tipo de Produto atualizado com Sucesso!", ProductTypeDTO_1.ProductTypeDTO.mapToDTO(productType));
    }
}
exports.ProductTypesService = ProductTypesService;
//# sourceMappingURL=ProductTypesService.js.map