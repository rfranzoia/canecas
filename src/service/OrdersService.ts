import {getRepository} from "typeorm";
import {ResponseData} from "../controller/ResponseData";
import {StatusCodes} from "http-status-codes";
import {Orders} from "../entity/Orders";
import { v4 as uuid } from 'uuid';
import {Users} from "../entity/Users";
import {Products} from "../entity/Products";
import {OrderItems} from "../entity/OrderItems";
import {OrdersHistory} from "../entity/OrdersHistory";

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
            skip: pageNumber * pageSize,
            take: pageSize,
            order: {
                orderDate: "DESC",
                orderStatus: "DESC"
            }
        });
        return new ResponseData(StatusCodes.OK, "", list);
    }

    async listByUserAndStatus(user_id: number, orderStatus: string, pageNumber:number, pageSize:number):(Promise<ResponseData>) {
        const list = await this.repository.find({
            skip: pageNumber * pageSize,
            take: pageSize,
            where: {
                user_id: user_id,
                orderStatus: orderStatus
            },
            order: {
                orderDate: "DESC"
            }
        });
        return new ResponseData(StatusCodes.OK, "", list);
    }

    async get(id: uuid):(Promise<ResponseData>) {
        const order = await this.repository.findOne({id});
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");
        }

        const o = await this.getCompleteOrder(order);
        return new ResponseData(StatusCodes.OK, "", o);
    }

    async create(user_id: number, orderItems: OrderItemRequest[]):(Promise<ResponseData>) {
        let order = await this.repository.findOne({user_id: user_id, orderStatus: "0"});
        if (!order) {
            order = await this.repository.create({
                user_id
            });
            await this.repository.save(order)
        }
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
        const o = await this.repository.findOne(order.id);
        return new ResponseData(StatusCodes.CREATED, "", await this.getCompleteOrder(o));
    }

    async delete(id: uuid):(Promise<ResponseData>) {
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
        // now delete de order
        await this.repository.delete({id});
        return new ResponseData(StatusCodes.OK, "Pedido removido com sucesso!", order);
    }

    async updateStatus(id: uuid, orderStatus: string, changeReason: string):(Promise<ResponseData>) {
        const order = await this.repository.findOne({id});
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");
        }

        // save status before change to new one
        const previous = order.orderStatus;

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

    // retrieves an order with all items and history
    // TODO: add history to the complete order
    private async getCompleteOrder(order: Orders) {
        const orderItems = await getRepository(OrderItems).find({
            where: {
                order_id: order.id
            }
        });

        let items: OrderItemDTO[] = [];
        for (let i = 0; i < orderItems.length; i++) {
            const oi = orderItems[i];
            const product = await getRepository(Products).findOne(oi.product_id);
            items.push(new OrderItemDTO(
                product,
                oi.quantity,
                oi.price,
                oi.discount));
        }

        const orderHistory = await getRepository(OrdersHistory).find({
            where: {
                order_id: order.id
            },
            order: {
                changeDate: "DESC"
            }
        });
        let history: OrderHistoryDTO[] = [];
        for (let i = 0; i < orderHistory.length; i++) {
            const oh = orderHistory[i];
            history.push(new OrderHistoryDTO(oh.changeDate, oh.previousStatus, oh.currentStatus, oh.changeReason))
        }
        return new OrderDTO(order.id, order.orderDate, order.orderStatus, items, history);
    }
}

type OrderItemRequest = {
    product_id: number;
    quantity: number;
    price: number;
    discount: number;
}

class OrderHistoryDTO {
    changeDate: Date;
    previousStatus: string;
    currentStatus: string;
    changeReason: string;

    constructor(changeDate: Date, previousStatus: string, currentStatus: string, changeReason: string) {
        this.changeDate = changeDate;
        this.previousStatus = previousStatus;
        this.currentStatus = currentStatus;
        this.changeReason = changeReason;
    }
}

class OrderItemDTO {
    product: Products;
    quantity: number;
    price: number;
    discount: number;

    constructor(product: Products, quantity: number, price: number, discount: number) {
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.discount = discount;
    }

}

class OrderDTO {
    id: uuid;
    user: Users;
    orderDate: Date;
    orderStatus: string;
    items: OrderItemDTO[];
    history: OrderHistoryDTO[];

    constructor(id: uuid, orderDate: Date, orderStatus: string, items: OrderItemDTO[], history: OrderHistoryDTO[]) {
        this.id = id;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.items = items;
        this.history = history;
    }
}