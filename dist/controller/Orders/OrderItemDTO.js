"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemDTO = void 0;
const ProductDTO_1 = require("../Products/ProductDTO");
class OrderItemDTO {
    constructor(id, product, quantity, price, discount) {
        this.id = id;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.discount = discount;
    }
    static mapToDTO(orderItem) {
        return new OrderItemDTO(Number(orderItem.id), ProductDTO_1.ProductDTO.mapToDTO(orderItem.product), Number(orderItem.quantity), Number(orderItem.price), Number(orderItem.discount));
    }
    static mapToListDTO(orderItems) {
        return orderItems.map(orderItem => OrderItemDTO.mapToDTO(orderItem));
    }
}
exports.OrderItemDTO = OrderItemDTO;
//# sourceMappingURL=OrderItemDTO.js.map