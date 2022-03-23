import {getRepository} from "typeorm";
import {ResponseData} from "../../controller/ResponseData";
import {StatusCodes} from "http-status-codes";
import {Orders} from "../../domain/Orders/Orders";
import { v4 as uuid } from 'uuid';
import {OrderHistoryDTO} from "../../controller/Orders/OrderHistoryDTO";
import {OrderDTO} from "../../controller/Orders/OrderDTO";
import {OrderItemDTO} from "../../controller/Orders/OrderItemDTO";
import {OrdersRepository} from "../../domain/Orders/OrdersRepository";
import {UserRepository} from "../../domain/Users/UserRepository";
import {Role} from "../Users/UsersService";
import {Users} from "../../domain/Users/Users";

export class OrdersService {

    repository = getRepository(Orders);

    async count():(Promise<ResponseData>) {
        return new ResponseData(StatusCodes.OK, "", {
            orders_count: await OrdersRepository.getInstance().count()
        });
    }

    async list(skip:number, limit:number, userId: number):(Promise<ResponseData>) {
        const user = await UserRepository.getInstance().findById(userId);
        const list: Orders[] = await OrdersRepository.getInstance().find(skip, limit);
        const orders = filterOrdersByUser(list, user);
        return new ResponseData(StatusCodes.OK, "",  await Promise.all(orders.map(async (order) => getCompleteOrder(order))));
    }

    async listByDateRange(startDate: Date, endDate: Date, skip:number, limit:number, userId: number):(Promise<ResponseData>) {
        const user = await UserRepository.getInstance().findById(userId);
        const list = await OrdersRepository.getInstance().findByDateRange(startDate, endDate, skip, limit);
        const orders = filterOrdersByUser(list, user);
        return new ResponseData(StatusCodes.OK, "",  await Promise.all(orders.map(async (order) => getCompleteOrder(order))));
    }


    async listByStatus(orderStatus: string, skip:number, limit:number, userId: number):(Promise<ResponseData>) {
        const user = await UserRepository.getInstance().findById(userId);
        const list = await OrdersRepository.getInstance().findByStatus(orderStatus, skip, limit);
        const orders = filterOrdersByUser(list, user);
        return new ResponseData(StatusCodes.OK, "", await Promise.all(orders.map(async (order) => getCompleteOrder(order))));
    }

    async get(id: uuid):(Promise<ResponseData>) {
        const order = await OrdersRepository.getInstance().findById(id);
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");
        }

        return new ResponseData(StatusCodes.OK, "", await getCompleteOrder(order));
    }

    async create(user_id: number, orderItems: OrderItemRequest[]):(Promise<ResponseData>) {
        let order = await OrdersRepository.getInstance().createOrder(user_id);
        return new ResponseData(StatusCodes.CREATED, "", await createItemsAndGetOrder(orderItems, order));
    }

    async addRemoveOrderItems(order_id: uuid, orderItems: OrderItemRequest[]):(Promise<ResponseData>) {
        const order = await OrdersRepository.getInstance().findById(order_id);
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado com o ID informado!");

        } else if (order.orderStatus !== "0") {
            return new ResponseData(StatusCodes.BAD_REQUEST, "O Pedido informado não pode ser modificado!");
        }

        // delete all existing items
        await OrdersRepository.getInstance().deleteOrderItemsByOrderId(order.id);

        return new ResponseData(StatusCodes.OK, "", await createItemsAndGetOrder(orderItems, order));
    }

    async deleteOrderAndItems(id: uuid):(Promise<ResponseData>) {
        const order = await OrdersRepository.getInstance().findById(id);
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");

        } else if (order.orderStatus !== "0") {
            return new ResponseData(StatusCodes.BAD_REQUEST, "O Pedido informado não pode ser excluido!");
        }

        // delete all items first
        await OrdersRepository.getInstance().deleteOrderItemsByOrderId(order.id);

        // delete should not be necessary since first history entry is created only after first status update
        await OrdersRepository.getInstance().deleteOrdersHistoryByOrderId(order.id);

        // now delete de order
        await OrdersRepository.getInstance().deleteOrderById(order.id);

        return new ResponseData(StatusCodes.NO_CONTENT, "Pedido removido com sucesso!");
    }

    async updateOrderStatus(id: uuid, orderStatus: string, changeReason: string):(Promise<ResponseData>) {
        const order = await OrdersRepository.getInstance().findById(id);
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");
        }

        // OrderStatus always "move" forward, never backwards
        if (Number(order.orderStatus) > Number(orderStatus)) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "O novo status de pedido informado não é válido!");
        }

        // save status before change to new one
        const previous = order.orderStatus;
        const orderDate = previous === "0"? new Date(): order.orderDate;

        await OrdersRepository.getInstance().updateOrderStatus(order, orderDate, orderStatus);

        // add the change to the OrdersHistory
        await OrdersRepository.getInstance().createOrdersHistory(order, {
            order_id: order.id,
            previousStatus: previous,
            currentStatus: order.orderStatus,
            changeReason: changeReason
        });

        return new ResponseData(StatusCodes.OK, "Situação do Pedido atualizada com sucesso!", getCompleteOrder(order));
    }

}

function filterOrdersByUser(list: Orders[], user: Users) {
    return list.filter(order => {
        if (user.role === Role.ADMIN) {
            return order;
        } else if (user.id === order.user_id) {
            return order;
        }
    });
}

// add items to an provided order
async function createItemsAndGetOrder(orderItems: OrderItemRequest[], order: Orders): Promise<OrderDTO> {
    await OrdersRepository.getInstance().createOrderItems(orderItems, order);
    return await getCompleteOrder(order);
}

// retrieves an order with all items and history
async function getCompleteOrder(order: Orders):Promise<OrderDTO> {

    const orderItems = await OrdersRepository.getInstance().findOrderItemsByOrderId(order.id);
    const orderHistory = await OrdersRepository.getInstance().findOrdersHistoryByOrderId(order.id);

    return OrderDTO.mapToDTO(order,OrderItemDTO.mapToListDTO(orderItems), OrderHistoryDTO.mapToListDTO(orderHistory));
}

export interface OrderItemRequest {
    product_id: number;
    quantity: number;
    price: number;
    discount: number;
}

export interface OrdersHistoryRequest {
    order_id: number;
    previousStatus: string;
    currentStatus: string;
    changeReason: string;
}