import {ProductDTO} from "./ProductDTO";
import {ProductPrices} from "../entity/ProductPrices";

export class ProductPriceDTO {
    id: number;
    product: ProductDTO;
    price: number;
    validFrom: Date;
    validTo: Date

    constructor(id: number, product: ProductDTO, price: number, validFrom: Date, validTo: Date) {
        this.id = id;
        this.product = product;
        this.price = price;
        this.validFrom = validFrom;
        this.validTo = validTo;
    }

    static mapToDTO(productPrice: ProductPrices): ProductPriceDTO {
        return new ProductPriceDTO(productPrice.id, productPrice.product, productPrice.price, productPrice.validFrom, productPrice.validTo);
    }

    static mapToListDTO(productPrices: ProductPrices[]): ProductPriceDTO[] {
        return productPrices.map(productPrice => ProductPriceDTO.mapToDTO(productPrice));
    }
}