import {Products} from "../../domain/Products/Products";
import {ProductTypeDTO} from "./ProductTypeDTO";

export class ProductDTO {
    id: number;
    name: string;
    description: string;
    image: string;
    productType: ProductTypeDTO;
    price: number;

    constructor(id: number, name: string, description: string, image: string, productType: ProductTypeDTO, price: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.productType = productType;
        this.price = price;
    }

    static mapToDTO(product: Products) {
        return new ProductDTO(product.id, product.name, product.description, product.image, ProductTypeDTO.mapToDTO(product.productType), product.price);
    }

    static mapToListDTO(products: Products[]): ProductDTO[] {
        return products.map(product => ProductDTO.mapToDTO(product));
    }
}