import {Between, getRepository, MoreThanOrEqual} from "typeorm";
import {ResponseData} from "../controller/ResponseData";
import {StatusCodes} from "http-status-codes";
import {Orders} from "../entity/Orders";
import { v4 as uuid } from 'uuid';
import {OrderItems} from "../entity/OrderItems";
import {OrdersHistory} from "../entity/OrdersHistory";
import {OrderHistoryDTO} from "../dto/OrderHistoryDTO";
import {OrderDTO} from "../dto/OrderDTO";
import {OrderItemDTO} from "../dto/OrderItemDTO";

export class OrdersService {

    repository = getRepository(Orders);
    
    async count(pageSize:number):(Promise<ResponseData>) {
        const count = await this.repository.count();
        return new ResponseData(StatusCodes.OK, "", { totalNumberOfRecords: count,
            pageSize: pageSize,
            totalNumberOfPages: Math.floor(count / pageSize) + (count % pageSize == 0? 0: 1)});
    }

    async list(pageNumber:number, pageSize:number):(Promise<ResponseData>) {
        const list = await this.repository.find({
            relations: ["user"],
            skip: pageNumber * pageSize,
            take: pageSize,
            order: {
                orderDate: "DESC",
                orderStatus: "DESC"
            }
        });
        return new ResponseData(StatusCodes.OK, "",  await Promise.all(list.map(async (order) => this.getCompleteOrder(order))));
    }

    async listByDateRange(startDate: Date, endDate: Date, pageNumber:number, pageSize:number):(Promise<ResponseData>) {
        const list = await this.repository.find({
            relations: ["user"],
            skip: pageNumber * pageSize,
            take: pageSize,
            where: {
                orderDate: Between(startDate, endDate)
            },
            order: {
                orderDate: "DESC",
                orderStatus: "DESC"
            }
        });
        return new ResponseData(StatusCodes.OK, "",  await Promise.all(list.map(async (order) => this.getCompleteOrder(order))));
    }


    async listByUserAndStatus(user_id: number, orderStatus: string, pageNumber:number, pageSize:number):(Promise<ResponseData>) {
        const list = await this.repository.find({
            relations: ["user"],
            skip: pageNumber * pageSize,
            take: pageSize,
            where: {
                user_id: user_id,
                orderStatus: orderStatus?
                                orderStatus:
                                MoreThanOrEqual("0")
            },
            order: {
                orderDate: "DESC"
            }
        });
        return new ResponseData(StatusCodes.OK, "", await Promise.all(list.map(async (order) => this.getCompleteOrder(order))));
    }

    async get(id: uuid):(Promise<ResponseData>) {
        const order = await this.repository.findOne({
            relations: ["user"],
            where: {
                id: id
            }
        });
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");
        }

        return new ResponseData(StatusCodes.OK, "", await this.getCompleteOrder(order));
    }

    async create(user_id: number, orderItems: OrderItemRequest[]):(Promise<ResponseData>) {
        let order = await this.repository.findOne({
            relations: ["user"],
            where: {
                user_id: user_id,
                orderStatus:"0"
            }});
        if (!order) {
            order = await this.repository.create({
                user_id
            });
            await this.repository.save(order)
        }
        return new ResponseData(StatusCodes.CREATED, "", await this.createItemsAndGetOrder(orderItems, order));
    }

    async addRemoveOrderItems(order_id: uuid, orderItems: OrderItemRequest[]):(Promise<ResponseData>) {
        const order = await this.repository.findOne(order_id);
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado com o ID informado!");

        } else if (order.orderStatus !== "0") {
            return new ResponseData(StatusCodes.BAD_REQUEST, "O Pedido informado não pode ser modificado!");
        }

        // delete all existing items
        await getRepository(OrderItems).delete({
            order_id: order.id
        });

        return new ResponseData(StatusCodes.OK, "", await this.createItemsAndGetOrder(orderItems, order));
    }

    async deleteOrderAndItems(id: uuid):(Promise<ResponseData>) {
        const order = await this.repository.findOne({id});
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");

        } else if (order.orderStatus !== "0") {
            return new ResponseData(StatusCodes.BAD_REQUEST, "O Pedido informado não pode ser excluido!");
        }
        // delete all items first
        await getRepository(OrderItems).delete({
            order_id: id
        });

        // delete should not be necessary since first history entry is created only after first status update

        // now delete de order
        await this.repository.delete({id});
        return new ResponseData(StatusCodes.OK, "Pedido removido com sucesso!", order);
    }

    async updateOrderStatus(id: uuid, orderStatus: string, changeReason: string):(Promise<ResponseData>) {
        const order = await this.repository.findOne({id});
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");
        }

        // OrderStatus always "move" forward, never backwards
        if (Number(order.orderStatus) > Number(orderStatus)) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "O novo status de pedido informado não é válido!");
        }

        // save status before change to new one
        const previous = order.orderStatus;

        // upon order confirmation, i.e., moving from status 0 to 1, update the order date accordingly
        order.orderDate = previous === "0"? new Date(): order.orderDate;
        order.orderStatus = orderStatus;
        await this.repository.save(order);

        // add the change to the OrdersHistory
        const history = await getRepository(OrdersHistory).create({
            order_id: order.id,
            previousStatus: previous,
            currentStatus: order.orderStatus,
            changeReason: changeReason
        });
        await getRepository(OrdersHistory).save(history);
        return new ResponseData(StatusCodes.OK, "Situação do Pedido atualizada com sucesso!", order);
    }

    // add items to an provided order
    private async createItemsAndGetOrder(orderItems: OrderItemRequest[], order: Orders): Promise<OrderDTO> {
        for (let i = 0; i < orderItems.length; i++) {
            const orderItem = await getRepository(OrderItems).create({
                order_id: order.id,
                product_id: orderItems[i].product_id,
                quantity: orderItems[i].quantity,
                price: orderItems[i].price,
                discount: orderItems[i].discount
            });
            await getRepository(OrderItems).save(orderItem);
        }
        return await this.getCompleteOrder(await this.repository.findOne({
            relations: ["user"],
            where: {
                id: order.id
            }
        }));
    }

    // retrieves an order with all items and history
    private async getCompleteOrder(order: Orders): Promise<OrderDTO> {
        const orderItems = await getRepository(OrderItems).find({
            relations: ["product", "product.productType"],
            where: {
                order_id: order.id
            }
        });
        const orderHistory = await getRepository(OrdersHistory).find({
            where: {
                order_id: order.id
            },
            order: {
                changeDate: "DESC"
            }
        });

        return OrderDTO.mapToDTO(order,OrderItemDTO.mapToListDTO(orderItems), OrderHistoryDTO.mapToListDTO(orderHistory));
    }
}

type OrderItemRequest = {
    product_id: number;
    quantity: number;
    price: number;
    discount: number;
}