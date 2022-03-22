"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const ResponseData_1 = require("../../controller/ResponseData");
const http_status_codes_1 = require("http-status-codes");
const ProductDTO_1 = require("../../controller/Products/ProductDTO");
const ProductsRepository_1 = require("../../domain/Products/ProductsRepository");
const ProductTypeRepository_1 = require("../../domain/Products/ProductTypeRepository");
class ProductsService {
    async count() {
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", ProductsRepository_1.ProductsRepository.getInstance().count());
    }
    async list(skip, limit) {
        const list = await ProductsRepository_1.ProductsRepository.getInstance().find(skip, limit);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", ProductDTO_1.ProductDTO.mapToListDTO(list));
    }
    async listByProductType(productTypeId, skip, limit) {
        const list = await ProductsRepository_1.ProductsRepository.getInstance().findByProductType(productTypeId, skip, limit);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", ProductDTO_1.ProductDTO.mapToListDTO(list));
    }
    async get(id) {
        const product = await ProductsRepository_1.ProductsRepository.getInstance().findById(id);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", ProductDTO_1.ProductDTO.mapToDTO(product));
    }
    async create({ name, description, product_type_id, image }) {
        if (await ProductsRepository_1.ProductsRepository.getInstance().findByName(name)) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.BAD_REQUEST, "Produto já existe com o nome informado!");
        }
        if (!await ProductTypeRepository_1.ProductTypesRepository.getInstance().findById(product_type_id)) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Tipo de Produto informado não existe!");
        }
        const product = await ProductsRepository_1.ProductsRepository.getInstance()
            .findById((await ProductsRepository_1.ProductsRepository.getInstance()
            .create({ name, description, product_type_id, image })).id);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.CREATED, "", ProductDTO_1.ProductDTO.mapToDTO(product));
    }
    async delete(id) {
        const product = await ProductsRepository_1.ProductsRepository.getInstance().findById(id);
        if (!product) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Produto com Id informado não existe!");
        }
        await ProductsRepository_1.ProductsRepository.getInstance().delete(id);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NO_CONTENT, "Produto removido com Sucesso!");
    }
    async update(id, { name, description, product_type_id, image }) {
        const product = await ProductsRepository_1.ProductsRepository.getInstance().findById(id);
        if (!product) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Produto com Id informado não existe!");
        }
        if (await ProductsRepository_1.ProductsRepository.getInstance().findByName(name)) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.BAD_REQUEST, "Produto já existe com o nome informado!");
        }
        if (!await ProductTypeRepository_1.ProductTypesRepository.getInstance().findById(product_type_id)) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Tipo de Produto informado não existe!");
        }
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "Produto atualizado com Sucesso!", ProductDTO_1.ProductDTO.mapToDTO(await ProductsRepository_1.ProductsRepository.getInstance()
            .update(id, { name, description, product_type_id, image })));
    }
}
exports.ProductsService = ProductsService;
//# sourceMappingURL=ProductsService.js.map