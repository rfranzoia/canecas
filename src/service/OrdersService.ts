import {getRepository} from "typeorm";
import {ResponseData} from "../controller/ResponseData";
import {StatusCodes} from "http-status-codes";
import {Orders} from "../entity/Orders";
import { v4 as uuid } from 'uuid';
import {Users} from "../entity/Users";
import {Products} from "../entity/Products";
import {OrderItems} from "../entity/OrderItems";

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

    async get(id: uuid):(Promise<ResponseData>) {
        const order = await this.repository.findOne({id});
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");
        }

        const o = await this.getCompleteOrder(order);
        return new ResponseData(StatusCodes.OK, "", o);
    }

    async create(user_id: number, orderItems: OrderItemRequest[]):(Promise<ResponseData>) {
        const order = await this.repository.create({
            user_id
        });
        await this.repository.save(order)
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
        await this.repository.delete({id});
        return new ResponseData(StatusCodes.OK, "Pedido removido com sucesso!", order);
    }

    // TODO: insert history data after update
    async updateStatus(id: uuid, orderStatus: string):(Promise<ResponseData>) {
        const order = await this.repository.findOne({id});
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");
        }
        order.orderStatus = orderStatus;
        await this.repository.save(order);
        return new ResponseData(StatusCodes.OK, "Pedido atualizado com sucesso!", order);
    }

    // retrieves an order with all items and history
    // TODO: add history to the complete order
    private async getCompleteOrder(order: Orders) {
        const orderItems = await getRepository(OrderItems).find({
            where: {
                order_id: order.id
            }
        });

        let items: OrderItem[] = [];
        for (let i = 0; i < orderItems.length; i++) {
            const oi = orderItems[i];
            const product = await getRepository(Products).findOne(oi.product_id);
            items.push(new OrderItem(oi.id,
                product,
                oi.quantity,
                oi.price,
                oi.discount));
        }
        return new Order(order.id, order.orderDate, order.orderStatus, items);
    }
}

type OrderItemRequest = {
    product_id: number;
    quantity: number;
    price: number;
    discount: number;
}

class OrderHistory {
    id: number;
    changeDate: Date;
    previousStatus: string;
    currentStatus: string;
    changeReason: string;

    constructor(id: number, changeDate: Date, previousStatus: string, currentStatus: string, changeReason: string) {
        this.id = id;
        this.changeDate = changeDate;
        this.previousStatus = previousStatus;
        this.currentStatus = currentStatus;
        this.changeReason = changeReason;
    }
}

class OrderItem {
    id: number;
    product: Products;
    quantity: number;
    price: number;
    discount: number;

    constructor(id: number, product: Products, quantity: number, price: number, discount: number) {
        this.id = id;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.discount = discount;
    }

}

class Order {
    id: uuid;
    user: Users;
    orderDate: Date;
    orderStatus: string;
    items: OrderItem[];
    history: OrderHistory[];

    constructor(id: uuid, orderDate: Date, orderStatus: string, items: OrderItem[]) {
        this.id = id;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.items = items;
    }
}