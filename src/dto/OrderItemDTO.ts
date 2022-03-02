import {OrderItems} from "../entity/OrderItems";
import {ProductDTO} from "./ProductDTO";

export class OrderItemDTO {
    id: number;
    product: ProductDTO;
    quantity: number;
    price: number;
    discount: number;

    constructor(id: number, product: ProductDTO, quantity: number, price: number, discount: number) {
        this.id = id;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.discount = discount;
    }

    static mapToDTO(orderItem: OrderItems): OrderItemDTO {
        return new OrderItemDTO(Number(orderItem.id),
                                ProductDTO.mapToDTO(orderItem.product),
                                Number(orderItem.quantity),
                                Number(orderItem.price),
                                Number(orderItem.discount));
    }

    static mapToListDTO(orderItems: OrderItems[]): OrderItemDTO[] {
        return orderItems.map(orderItem => OrderItemDTO.mapToDTO(orderItem));
    }
}