import {Products} from "../../domain/Products/Products";
import {ProductTypeDTO} from "./ProductTypeDTO";

export class ProductDTO {
    id: number;
    name: string;
    description: string;
    image: string;
    productType: ProductTypeDTO;

    constructor(id: number, name: string, description: string, image: string, productType: ProductTypeDTO) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.productType = productType;
    }

    static mapToDTO(product: Products) {
        return new ProductDTO(product.id, product.name, product.description, product.image, ProductTypeDTO.mapToDTO(product.productType));
    }

    static mapToListDTO(products: Products[]): ProductDTO[] {
        return products.map(product => ProductDTO.mapToDTO(product));
    }
}