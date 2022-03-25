import {getRepository} from "typeorm";
import {Orders} from "../../domain/Orders/Orders";
import { v4 as uuid } from 'uuid';
import {OrderHistoryDTO} from "../../controller/Orders/OrderHistoryDTO";
import {OrderDTO} from "../../controller/Orders/OrderDTO";
import {OrderItemDTO} from "../../controller/Orders/OrderItemDTO";
import {OrdersRepository} from "../../domain/Orders/OrdersRepository";
import {UserRepository} from "../../domain/Users/UserRepository";
import {Role} from "../Users/UsersService";
import {Users} from "../../domain/Users/Users";
import NotFoundError from "../../utils/errors/NotFoundError";
import BadRequestError from "../../utils/errors/BadRequestError";
import InternalServerError from "../../utils/errors/InternalServerError";
import logger from "../../utils/Logger";

export class OrdersService {

    repository = getRepository(Orders);

    async count(): Promise<Number> {
        return await OrdersRepository.getInstance().count();
    }

    async list(skip:number, limit:number, userId: number): Promise<OrderDTO[]> {
        const user = await getUserById(userId);
        const list: Orders[] = await OrdersRepository.getInstance().find(skip, limit);
        const orders = filterOrdersByUser(list, user);
        return await Promise.all(orders.map(async (order) => getCompleteOrder(order)));
    }

    async listByDateRange(startDate: Date, endDate: Date, skip:number, limit:number, userId: number): Promise<OrderDTO[] | InternalServerError> {
        const user = await getUserById(userId);
        const list = await OrdersRepository.getInstance().findByDateRange(startDate, endDate, skip, limit);
        const orders = filterOrdersByUser(list, user);
        return await Promise.all(orders.map(async (order) => getCompleteOrder(order)));
    }


    async listByStatus(orderStatus: string, skip:number, limit:number, userId: number): Promise<OrderDTO[] | InternalServerError> {
        const user = await getUserById(userId);
        const list = await OrdersRepository.getInstance().findByStatus(orderStatus, skip, limit);
        const orders = filterOrdersByUser(list, user);
        return await Promise.all(orders.map(async (order) => getCompleteOrder(order)));
    }

    async listOrderItemsByOrderId(orderId: uuid, skip: number, limit: number, userId: number): Promise<OrderItemDTO[] | NotFoundError> {
        const user = await getUserById(userId);
        const order = await OrdersRepository.getInstance().findById(orderId);
        if (!order) {
            return new NotFoundError(`Nenhum pedido encontrado com o ID ${orderId}!`);

        } else if (user.role !== Role.ADMIN && order.user.id !== user.id) {
            return new NotFoundError(`Nenhum pedido encontrado com o ID ${orderId}!`)
        }

        return OrderItemDTO.mapToListDTO(await OrdersRepository.getInstance().findOrderItemsByOrderId(orderId, skip, limit));
    }

    async listOrderHistoryByOrderId(orderId: uuid, skip: number, limit: number, userId: number): Promise<OrderHistoryDTO[] | NotFoundError> {
        const user = await getUserById(userId);
        const order = await OrdersRepository.getInstance().findById(orderId);
        if (!order) {
            return new NotFoundError(`Nenhum pedido encontrado com o ID ${orderId}!`)

        } else if (user.role !== Role.ADMIN && order.user.id !== user.id) {
            return new NotFoundError(`Nenhum pedido encontrado com o ID ${orderId}!`)
        }

        return OrderHistoryDTO.mapToListDTO(await OrdersRepository.getInstance().findOrdersHistoryByOrderId(orderId, skip, limit));
    }

    async get(orderId: uuid, userId: number): Promise<OrderDTO | NotFoundError> {
        const user = await getUserById(userId);
        const order = await OrdersRepository.getInstance().findById(orderId);
        if (!order) {
            return new NotFoundError(`Nenhum pedido encontrado com o ID ${orderId}!`)

        } else if (user.role !== Role.ADMIN && order.user.id !== user.id) {
            return new NotFoundError(`Nenhum pedido encontrado com o ID ${orderId}!`)
        }

        return await getCompleteOrder(order);
    }

    async create(userId: number, orderItems: OrderItemRequest[]): Promise<OrderDTO | InternalServerError> {
        let order = await OrdersRepository.getInstance().createOrder(userId);
        return await createItemsAndGetOrder(orderItems, order);
    }

    async addRemoveOrderItems(orderId: uuid, orderItems: OrderItemRequest[]): Promise<OrderDTO | NotFoundError | BadRequestError | InternalServerError> {
        const order = await OrdersRepository.getInstance().findById(orderId);
        if (!order) {
            return new NotFoundError(`Nenhum pedido encontrado com o ID ${orderId}!`)

        } else if (order.orderStatus !== OrderStatus.NEW) {
            return new BadRequestError("O Pedido informado não pode ser modificado!")
        }

        try {
            // delete all existing items
            await OrdersRepository.getInstance().deleteOrderItemsByOrderId(order.id);

            return await createItemsAndGetOrder(orderItems, order);
        } catch (error) {
            logger.error("Error while deleting items", error);
            return new InternalServerError("Ocorreu um erro ao remover os items do pedido")
        }

    }

    async deleteOrderAndItems(orderId: uuid): Promise<void | NotFoundError | BadRequestError | InternalServerError> {
        const order = await OrdersRepository.getInstance().findById(orderId);
        if (!order) {
            return new NotFoundError(`Nenhum pedido encontrado com o ID ${orderId}!`)

        } else if (order.orderStatus !== OrderStatus.NEW) {
            return new BadRequestError("O Pedido informado não pode ser modificado!")
        }
        try {
            // delete all items first
            await OrdersRepository.getInstance().deleteOrderItemsByOrderId(order.id);

            // delete should not be necessary since first history entry is created only after first status update
            await OrdersRepository.getInstance().deleteOrdersHistoryByOrderId(order.id);

            // now delete de order
            await OrdersRepository.getInstance().deleteOrderById(order.id);
        } catch (error) {
            logger.error("Error while deleting order/items/history", error);
            return new InternalServerError("Ocorreu um erro ao remover o pedido ou os items ou o histórico")
        }

    }

    async updateOrderStatus(orderId: uuid, orderStatus: string, changeReason: string, userId: number): Promise<OrderDTO | NotFoundError | BadRequestError | InternalServerError> {
        const user = await getUserById(userId);
        const order = await OrdersRepository.getInstance().findById(orderId);
        if (!order) {
            return new NotFoundError(`Nenhum pedido encontrado com o ID ${orderId}!`)
        }
        // OrderStatus always "move" forward, never backwards
        if (Number(order.orderStatus) > Number(orderStatus)) {
            return new BadRequestError("O novo status de pedido informado não é válido!")
        }
        if (user.role !== Role.ADMIN) {
            if (orderStatus !== OrderStatus.CREATED && orderStatus !== OrderStatus.CANCELED) {
                return new BadRequestError("O novo status de pedido informado não é válido!")
            }
        }
        try {
            // save status before change to new one
            const previous = order.orderStatus;
            const orderDate = previous === OrderStatus.NEW? new Date(): order.orderDate;

            await OrdersRepository.getInstance().updateOrderStatus(order, orderDate, orderStatus);

            // add the change to the OrdersHistory
            await OrdersRepository.getInstance().createOrdersHistory(order, {
                order_id: order.id,
                previousStatus: previous,
                currentStatus: order.orderStatus,
                changeReason: changeReason
            });

            return getCompleteOrder(order);
        } catch (error) {
            logger.error("Error while updating order", error);
            return new InternalServerError("Ocorreu um erro ao atualizar o status do pedido")
        }
    }

}

function filterOrdersByUser(list: Orders[], user: Users): Orders[] {
    return list.filter(order => {
        if (user.role === Role.ADMIN) {
            return order;
        } else if (user.id === order.user_id) {
            return order;
        }
    });
}

async function getUserById(userId: number): Promise<Users> {
    return await UserRepository.getInstance().findById(userId);
}

// add items to a provided order
async function createItemsAndGetOrder(orderItems: OrderItemRequest[], order: Orders): Promise<OrderDTO | InternalServerError> {
    try {
        await OrdersRepository.getInstance().createOrderItems(orderItems, order);
        return await getCompleteOrder(order);
    } catch (error) {
        logger.error("Error while creating order items", error);
        return new InternalServerError("Ocorreu um erro ao criar os items do pedido");
    }

}

// retrieves an order with all items and history
async function getCompleteOrder(order: Orders): Promise<OrderDTO> {

    try {
        const orderItems = await OrdersRepository.getInstance().findOrderItemsByOrderId(order.id, 0, 0);
        const orderHistory = await OrdersRepository.getInstance().findOrdersHistoryByOrderId(order.id, 0, 0);

        return OrderDTO.mapToDTO(order,OrderItemDTO.mapToListDTO(orderItems), OrderHistoryDTO.mapToListDTO(orderHistory));
    } catch (error) {
        logger.error("Error while fetching complete order", error);
        throw new InternalServerError("Ocorreu um erro ao buscar o pedido completo");
    }
}

export enum OrderStatus { NEW = "0", CREATED = "1", IN_PROGRESS = "2", FINISHED = "3", CANCELED = "9" }

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