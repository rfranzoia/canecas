import {ProductTypes} from "../entity/ProductTypes";

export class ProductTypeDTO {
    id: number;
    description: string;
    image: string;

    constructor(id: number, description: string, image: string) {
        this.id = id;
        this.description = description;
        this.image = image;
    }

    static mapToDTO(productType: ProductTypes): ProductTypeDTO {
        return new ProductTypeDTO(productType.id, productType.description, productType.image);
    }

    static mapToListDTO(productTypes: ProductTypes[]): ProductTypeDTO[] {
        return productTypes.map(productType => ProductTypeDTO.mapToDTO(productType));
    }
}