import {ProductDTO} from "./ProductDTO";
import {ProductPrices} from "../../domain/Products/ProductPrices";

export class ProductPriceDTO {
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

    static mapToDTO(productPrice: ProductPrices): ProductPriceDTO {
        return new ProductPriceDTO(productPrice.id, productPrice.product, productPrice.price, productPrice.validUntil);
    }

    static mapToListDTO(productPrices: ProductPrices[]): ProductPriceDTO[] {
        return productPrices.map(productPrice => ProductPriceDTO.mapToDTO(productPrice));
    }
}