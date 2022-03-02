import {ProductTypes} from "../entity/ProductTypes";

export class ProductTypeDTO {
    description: string;

    constructor(description: string) {
        this.description = description;
    }

    static mapToDTO(productType: ProductTypes): ProductTypeDTO {
        return new ProductTypeDTO(productType.description);
    }

    static mapToListDTO(productTypes: ProductTypes[]): ProductTypeDTO[] {
        return productTypes.map(productType => ProductTypeDTO.mapToDTO(productType));
    }
}