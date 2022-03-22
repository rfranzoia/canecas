"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDTO = void 0;
const ProductTypeDTO_1 = require("./ProductTypeDTO");
class ProductDTO {
    constructor(id, name, description, image, productType) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.productType = productType;
    }
    static mapToDTO(product) {
        return new ProductDTO(product.id, product.name, product.description, product.image, ProductTypeDTO_1.ProductTypeDTO.mapToDTO(product.productType));
    }
    static mapToListDTO(products) {
        return products.map(product => ProductDTO.mapToDTO(product));
    }
}
exports.ProductDTO = ProductDTO;
//# sourceMappingURL=ProductDTO.js.map