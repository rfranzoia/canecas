"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTypeDTO = void 0;
class ProductTypeDTO {
    constructor(id, description, image) {
        this.id = id;
        this.description = description;
        this.image = image;
    }
    static mapToDTO(productType) {
        return new ProductTypeDTO(productType.id, productType.description, productType.image);
    }
    static mapToListDTO(productTypes) {
        return productTypes.map(productType => ProductTypeDTO.mapToDTO(productType));
    }
}
exports.ProductTypeDTO = ProductTypeDTO;
//# sourceMappingURL=ProductTypeDTO.js.map