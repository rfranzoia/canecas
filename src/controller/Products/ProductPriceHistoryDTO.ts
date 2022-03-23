import {ProductDTO} from "./ProductDTO";
import {ProductPriceHistory} from "../../domain/Products/ProductPriceHistory";

export class ProductPriceHistoryDTO {
    id: number;
    product: ProductDTO;
    price: number;
    validUntil: Date;

    constructor(id: number, product: ProductDTO, price: number, validUntil: Date) {
        this.id = id;
        this.product = product;
        this.price = price;
        this.validUntil = validUntil;
    }

    static mapToDTO(productPrice: ProductPriceHistory): ProductPriceHistoryDTO {
        return new ProductPriceHistoryDTO(productPrice.id, productPrice.product, productPrice.price, productPrice.validUntil);
    }

    static mapToListDTO(productPrices: ProductPriceHistory[]): ProductPriceHistoryDTO[] {
        return productPrices.map(productPrice => ProductPriceHistoryDTO.mapToDTO(productPrice));
    }
}