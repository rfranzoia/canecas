import logger from "../../utils/Logger";
import NotFoundError from "../../utils/errors/NotFoundError";
import BadRequestError from "../../utils/errors/BadRequestError";
import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import {Order, OrderItem, OrderStatus, OrderStatusHistory} from "../../domain/orders/Orders";
import {ordersRepository} from "../../domain/orders/OrdersRepository";
import {userRepository} from "../../domain/Users/UsersRepository";
import {productRepository} from "../../domain/products/ProductRepository";
import {Role} from "../../domain/Users/Users";

class OrdersService {

    async count() {
        return await ordersRepository.count();
    }

    async list() {
        return await ordersRepository.findAll();
    }

    async listByDateRange(startDate: string, endDate: string) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end < start) {
                return new BadRequestError("End date must be after start date");
            }
            return await ordersRepository.findByDateRange(start, end);
        } catch (error) {
            return new BadRequestError("Start and/or End date(s) not valid");
        }
    }

    async get(id: string) {
        const order = await ordersRepository.findById(id);
        if (!order) {
            return new NotFoundError(`No Order found with ID ${id}`);
        }
        return order;
    }

    async create(order: Order) {
        if (!await userRepository.findByEmail(order.userEmail)) {
            return new BadRequestError("The provided user e-mail is not valid");
        } else if (!isValid(order.items)) {
            return new BadRequestError("One or more item is not valid for this order");
        }
        try {
            const totalPrice = order.items.reduce((acc, item) => {
                return acc + (item.price * item.amount);
            }, 0);
            order = {
                ...order,
                totalPrice: totalPrice
            };
            return await ordersRepository.create(order);
        } catch (error) {
            logger.error("Error while creating", error);
            return new InternalServerErrorError("Error while creating the new Order", error);
        }
    }

    async delete(id: string) {
        const order = await ordersRepository.findById(id);
        if (!order) {
            return new NotFoundError(`No order found with ID ${id}`);
        }
        const result = await ordersRepository.delete(id);
        if (result instanceof InternalServerErrorError) {
            return result;
        }
    }

    async update(id: string, order: Order, userEmail: string) {
        try {
            const user = await userRepository.findByEmail(userEmail);
            const existingOrder = await ordersRepository.findById(id);

            if (user.role !== Role.ADMIN) {
                if (existingOrder.userEmail !== user.email) {
                    return new NotFoundError("Order doesn't exists");

                } else if (order.status && order.status !== OrderStatus.CREATED && order.status !== OrderStatus.CANCELED) {
                    return new BadRequestError("Customers can only confirm or cancel orders");
                }
            }

            if (!existingOrder) {
                return new NotFoundError("Order doesn't exists");
            }

            const prevStatus = existingOrder.status;
            if (prevStatus === OrderStatus.FINISHED || prevStatus === OrderStatus.CANCELED) {
                return new BadRequestError("This order cannot be changed anymore");
            } else if (order.status && existingOrder.status > order.status) {
                return new BadRequestError("Orders status can only move forward");
            }
            if (order.status && order.status in OrderStatus) {
                if (!(order.status in OrderStatus)) {
                    return new BadRequestError("Order status is not valid");

                }
                const history: OrderStatusHistory = {
                    changeDate: new Date(),
                    prevStatus: prevStatus,
                    currStatus: order.status,
                    reason: order.statusReason ? order.statusReason : `Order status update ${OrderStatus[order.status]}`
                }
                order.statusHistory = [
                    ...existingOrder.statusHistory,
                    history
                ]
            }
            if (existingOrder.status === OrderStatus.NEW && order.items) {
                order.totalPrice = order.items.reduce((acc, item) => {
                    return acc + (item.price * item.amount);
                }, 0);
            }
            return await ordersRepository.update(id, order);
        } catch (error) {
            logger.error("Error while updating order", error);
            return new InternalServerErrorError("Error while updating order", error);
        }
    }
}

const isValid = (orderItems: OrderItem[]) => {
    for (let i = 0; i < orderItems.length; i++) {
        if (!productRepository.findByName(orderItems[i].product)) {
            return false;
        } else if (orderItems[i].price < 0 || orderItems[i].amount < 0) {
            return false;
        }
    }
    return true;
}

export const ordersService = new OrdersService();