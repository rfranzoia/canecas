"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPriceDTO = void 0;
class ProductPriceDTO {
    constructor(id, product, price, validFrom, validTo) {
        this.id = id;
        this.product = product;
        this.price = price;
        this.validFrom = validFrom;
        this.validTo = validTo;
    }
    static mapToDTO(productPrice) {
        return new ProductPriceDTO(productPrice.id, productPrice.product, productPrice.price, productPrice.validFrom, productPrice.validTo);
    }
    static mapToListDTO(productPrices) {
        return productPrices.map(productPrice => ProductPriceDTO.mapToDTO(productPrice));
    }
}
exports.ProductPriceDTO = ProductPriceDTO;
//# sourceMappingURL=ProductPriceDTO.js.map