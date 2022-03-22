"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDTO = void 0;
const UserDTO_1 = require("../Users/UserDTO");
class OrderDTO {
    constructor(id, orderDate, user, orderStatus, items, history) {
        this.id = id;
        this.orderDate = orderDate;
        this.user = user;
        this.orderStatus = orderStatus;
        this.items = items;
        this.history = history;
    }
    static mapToDTO(order, items, history) {
        return new OrderDTO(order.id, order.orderDate, UserDTO_1.UserDTO.mapToDTO(order.user), order.orderStatus, items, history);
    }
}
exports.OrderDTO = OrderDTO;
//# sourceMappingURL=OrderDTO.js.map