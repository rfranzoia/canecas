"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRepository = void 0;
const typeorm_1 = require("typeorm");
const Orders_1 = require("./Orders");
const OrderItems_1 = require("./OrderItems");
const OrdersHistory_1 = require("./OrdersHistory");
class OrdersRepository {
    constructor() {
        this.ordersRepository = (0, typeorm_1.getRepository)(Orders_1.Orders);
        this.orderItemsRepository = (0, typeorm_1.getRepository)(OrderItems_1.OrderItems);
        this.ordersHistoryRepository = (0, typeorm_1.getRepository)(OrdersHistory_1.OrdersHistory);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new OrdersRepository();
        }
        return this.instance;
    }
    async count() {
        return await this.ordersRepository.count();
    }
    async find(skip, limit) {
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
    async findByDateRange(startDate, endDate, skip, limit) {
        const list = this.ordersRepository.find({
            relations: ["user"],
            skip: skip,
            take: limit,
            where: {
                orderDate: (0, typeorm_1.Between)(startDate, endDate)
            },
            order: {
                orderDate: "DESC",
                orderStatus: "DESC"
            }
        });
        return list;
    }
    async findByUserAndStatus(user_id, orderStatus, skip, limit) {
        const list = this.ordersRepository.find({
            relations: ["user"],
            skip: skip,
            take: limit,
            where: {
                user_id: user_id,
                orderStatus: orderStatus ?
                    orderStatus :
                    (0, typeorm_1.MoreThanOrEqual)("0")
            },
            order: {
                orderDate: "DESC"
            }
        });
        return list;
    }
    async findById(id) {
        return this.ordersRepository.findOne({
            relations: ["user"],
            where: {
                id: id
            }
        });
    }
    async createOrder(user_id) {
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
            await this.ordersRepository.save(order);
        }
        return order;
    }
    async createOrderItems(orderItems, order) {
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
    async createOrdersHistory(order, orderHistoryRequest) {
        const orderHistory = await this.ordersHistoryRepository.create(orderHistoryRequest);
        await this.ordersHistoryRepository.save(orderHistory);
        return orderHistory;
    }
    async findOrderItemsByOrderId(orderId) {
        return await this.orderItemsRepository.find({
            relations: ["product", "product.productType"],
            where: {
                order_id: orderId
            }
        });
    }
    async deleteOrderById(orderId) {
        await this.ordersRepository.delete({
            id: orderId
        });
    }
    async deleteOrderItemsByOrderId(orderId) {
        await this.orderItemsRepository.delete({
            order_id: orderId
        });
    }
    async deleteOrdersHistoryByOrderId(orderId) {
        await this.ordersHistoryRepository.delete({
            order_id: orderId
        });
    }
    async updateOrderStatus(order, orderDate, orderStatus) {
        const previous = order.orderStatus;
        // upon order confirmation, i.e., moving from status 0 to 1, update the order date accordingly
        order.orderDate = previous === "0" ? new Date() : order.orderDate;
        order.orderStatus = orderStatus;
        await this.ordersRepository.save(order);
        return order;
    }
    async findOrdersHistoryByOrderId(orderId) {
        return await this.ordersHistoryRepository.find({
            where: {
                order_id: orderId
            },
            order: {
                changeDate: "DESC"
            }
        });
    }
}
exports.OrdersRepository = OrdersRepository;
//# sourceMappingURL=OrdersRepository.js.map