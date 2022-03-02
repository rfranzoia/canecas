import {UserDTO} from "./UserDTO";
import {OrderItemDTO} from "./OrderItemDTO";
import {OrderHistoryDTO} from "./OrderHistoryDTO";
import { v4 as uuid } from 'uuid';
import {Orders} from "../entity/Orders";

export class OrderDTO {
    id: uuid;
    orderDate: Date;
    user: UserDTO;
    orderStatus: string;
    items: OrderItemDTO[];
    history: OrderHistoryDTO[];

    constructor(id: uuid, orderDate: Date, user: UserDTO, orderStatus: string, items: OrderItemDTO[], history: OrderHistoryDTO[]) {
        this.id = id;
        this.orderDate = orderDate;
        this.user = user;
        this.orderStatus = orderStatus;
        this.items = items;
        this.history = history;
    }

    static mapToDTO(order: Orders, items: OrderItemDTO[], history: OrderHistoryDTO[]): OrderDTO {
        return new OrderDTO(order.id, order.orderDate, UserDTO.mapToDTO(order.user), order.orderStatus, items, history);
    }

}