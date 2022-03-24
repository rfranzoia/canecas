import {Between, getRepository, MoreThanOrEqual} from "typeorm";
import {Orders} from "./Orders";
import { v4 as uuid } from 'uuid';
import {OrderItems} from "./OrderItems";
import {OrdersHistory} from "./OrdersHistory";
import {OrderItemRequest, OrdersHistoryRequest} from "../../service/Orders/OrdersService";

export class OrdersRepository {

    static instance: OrdersRepository;

    ordersRepository = getRepository(Orders);
    orderItemsRepository = getRepository(OrderItems);
    ordersHistoryRepository = getRepository(OrdersHistory);

    static getInstance(): OrdersRepository {
        if (!this.instance) {
            this.instance = new OrdersRepository();
        }
        return this.instance;
    }

    async count():  Promise<Number> {
        return await this.ordersRepository.count();
    }

    async find(skip: number, limit: number): Promise<Orders[]> {
        return await this.ordersRepository.find({
            relations: ["user"],
            skip: skip,
            take: limit,
            order: {
                orderDate: "DESC",
                orderStatus: "DESC"
            }
        });
    }

    async findByDateRange(startDate: Date, endDate: Date, skip:number, limit:number):Promise<Orders[]> {
        return this.ordersRepository.find({
            relations: ["user"],
            skip: skip,
            take: limit,
            where: {
                orderDate: Between(startDate, endDate)
            },
            order: {
                orderDate: "DESC",
                orderStatus: "DESC"
            }
        });
    }

    async findByStatus(orderStatus: string, skip: number, limit: number): Promise<Orders[]> {
        return this.ordersRepository.find({
            relations: ["user"],
            skip: skip,
            take: limit,
            where: {
                orderStatus: orderStatus?
                    orderStatus:
                    MoreThanOrEqual("0")
            },
            order: {
                orderDate: "DESC"
            }
        });
    }

    async findById(id: uuid): Promise<Orders> {
        return this.ordersRepository.findOne({
            relations: ["user"],
            where: {
                id: id
            }
        });
    }

    async createOrder(user_id: number): Promise<Orders> {
        let order = await this.ordersRepository.findOne({
            relations: ["user"],
            where: {
                user_id: user_id,
                orderStatus: "0"
            }
        });
        if (!order) {
            order = await this.ordersRepository.create({
                user_id
            });
            await this.ordersRepository.save(order)
        }
        return this.ordersRepository.findOne({
            relations: ["user"],
            where: {
                id: order.id
            }
        });
    }

    async createOrderItems(orderItems: OrderItemRequest[], order: Orders) {
        for (let i = 0; i < orderItems.length; i++) {
            const orderItem = await this.orderItemsRepository.create({
                order_id: order.id,
                product_id: orderItems[i].product_id,
                quantity: orderItems[i].quantity,
                price: orderItems[i].price,
                discount: orderItems[i].discount
            });
            await this.orderItemsRepository.save(orderItem);
        }
    }

    async createOrdersHistory(order: Orders, orderHistoryRequest: OrdersHistoryRequest): Promise<OrdersHistory> {
        const orderHistory = await this.ordersHistoryRepository.create(orderHistoryRequest);
        await this.ordersHistoryRepository.save(orderHistory);
        return orderHistory;
    }

    async findOrderItemsByOrderId(orderId: number, skip: number, limit: number): Promise<OrderItems[]> {
        return await this.orderItemsRepository.find({
            relations: ["product", "product.productType"],
            skip: skip,
            take: limit,
            where: {
                order_id: orderId
            }
        });
    }

    async deleteOrderById(orderId: number) {
        await this.ordersRepository.delete({
            id: orderId
        })
    }

    async deleteOrderItemsByOrderId(orderId: number) {
        await this.orderItemsRepository.delete({
            order_id: orderId
        });
    }

    async deleteOrdersHistoryByOrderId(orderId: number) {
        await this.ordersHistoryRepository.delete({
            order_id: orderId
        });
    }

    async updateOrderStatus(order: Orders, orderDate: Date, orderStatus: string): Promise<Orders> {
        const previous = order.orderStatus;

        // upon order confirmation, i.e., moving from status 0 to 1, update the order date accordingly
        order.orderDate = previous === "0"? new Date(): order.orderDate;
        order.orderStatus = orderStatus;
        await this.ordersRepository.save(order);

        return order;
    }

    async findOrdersHistoryByOrderId(orderId: number, skip: number, limit: number): Promise<OrdersHistory[]> {
        return await this.ordersHistoryRepository.find({
            skip: skip,
            take: limit,
            where: {
                order_id: orderId
            },
            order: {
                changeDate: "DESC"
            }
        });
    }

}
