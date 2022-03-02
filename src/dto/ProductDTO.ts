import {ProductTypes} from "../entity/ProductTypes";
import {Products} from "../entity/Products";
import {ProductTypeDTO} from "./ProductTypeDTO";

export class ProductDTO {
    name: string;
    description: string;
    image: string;
    productType: ProductTypeDTO;

    constructor(name: string, description: string, image: string, productType: ProductTypeDTO) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.productType = productType;
    }

    static mapToDTO(product: Products) {
        return new ProductDTO(product.name, product.description, product.image, ProductTypeDTO.mapToDTO(product.productType));
    }

    static mapToListDTO(products: Products[]): ProductDTO[] {
        return products.map(product => ProductDTO.mapToDTO(product));
    }
}