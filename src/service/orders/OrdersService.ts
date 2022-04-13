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

    async count(userEmail: string) {
        return await ordersRepository.count(userEmail);
    }

    async list(userEmail: string, skip: number, limit: number) {
        return await filterOrdersByUser(await ordersRepository.findAll(skip, limit), userEmail);
    }

    async listByDateRange(startDate: string, endDate: string, userEmail: string, skip: number, limit: number) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end < start) {
                return new BadRequestError("End date must be after start date");
            }
            return await filterOrdersByUser(await ordersRepository.findByDateRange(start, end, skip, limit), userEmail);
        } catch (error) {
            return new BadRequestError("Start and/or End date(s) not valid");
        }
    }

    async get(id: string, userEmail: string) {
        const order = await ordersRepository.findById(id);
        const user = await userRepository.findByEmail(userEmail);
        if (!order || (user.role !== Role.ADMIN && order.userEmail !== userEmail)) {
            return new NotFoundError(`No Order found with ID ${id}`);
        }
        return order;
    }

    async create(order: Order) {
        if (order.userEmail.trim().length === 0) {
            return new BadRequestError("User Email cannot be empty!");
        } else if (!await userRepository.findByEmail(order.userEmail)) {
            return new BadRequestError("The provided user e-mail is not valid");
        } else if (!isValid(order.items)) {
            return new BadRequestError("One or more item is not valid for this order");
        }

        if (order.orderDate.toString().trim().length === 0) {
            return new BadRequestError("Order date cannot be empty!");
        }

        const orderDate = new Date(order.orderDate);
        const today = new Date();
        if (orderDate.valueOf() > today.valueOf()) {
            return new BadRequestError("Order date cannot be after today's date");
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
            logger.error("Error while creating", error.stack);
            return new InternalServerErrorError("Error while creating the new Order", error);
        }
    }

    async delete(id: string, userEmail) {
        const user = await userRepository.findByEmail(userEmail);
        const order = await ordersRepository.findById(id);
        if (!order || (user.role !== Role.ADMIN && order.userEmail !== userEmail)) {
            return new NotFoundError(`No order found with ID ${id}`);
        }
        const result = await ordersRepository.delete(id);
        if (result instanceof InternalServerErrorError) {
            return result;
        }
    }

    async update(id: string, order: Order, reqUserEmail: string) {
        try {
            const user = await userRepository.findByEmail(reqUserEmail);
            const existingOrder = await ordersRepository.findById(id);

            // validate if the order exists at all
            if (!existingOrder) {
                return new NotFoundError(`No Order found with ID ${id}`);
            }

            // validate if the user can access the order and can make the changes
            if (user.role !== Role.ADMIN) {
                if (existingOrder.userEmail !== user.email) {
                    return new NotFoundError(`No Order found with ID ${id}`);

                } else if (order.status && order.status !== OrderStatus.CONFIRMED && order.status !== OrderStatus.CANCELED) {
                    return new BadRequestError("Customers can only confirm or cancel orders");
                }
            }

            // status changes and items changes are mutually exclusive
            // these are also the only possible changes in the order
            if (order.status) {
                // if this is a status change
                if (!(order.status in OrderStatus)) {
                    return new BadRequestError(`Order status ${order.status} is not valid`);
                }

                const prevStatus = existingOrder.status;

                // status changes cannot occur for FINISHED and CANCELED orders
                if (prevStatus === OrderStatus.FINISHED || prevStatus === OrderStatus.CANCELED) {
                    return new BadRequestError("This order cannot be changed anymore");
                } else if (existingOrder.status > order.status) {
                    return new BadRequestError("Orders status can only move forward");
                }

                let reason = `Status update ${OrderStatus[order.status]}`;
                if (order.statusReason) {
                    reason = reason.concat("/").concat(`Reason: ${order.statusReason}`)
                }
                const history: OrderStatusHistory = {
                    changeDate: new Date(),
                    prevStatus: prevStatus,
                    currStatus: order.status,
                    reason: reason
                }
                order.statusHistory = [
                    ...existingOrder.statusHistory,
                    history
                ]
            } else if (order.items) {
                // if this is an items
                if (existingOrder.status !== OrderStatus.NEW) {
                    return new BadRequestError("Items change can only occur for NEW orders");
                }
                order.totalPrice = order.items.reduce((acc, item) => {
                    return acc + (item.price * item.amount);
                }, 0);

                if (order.userEmail.trim().length === 0) {
                    return new BadRequestError("User Email cannot be empty!");
                } else if (!await userRepository.findByEmail(order.userEmail)) {
                    return new BadRequestError("The provided user e-mail is not valid");
                }

                if (order.orderDate.toString().trim().length === 0) {
                    return new BadRequestError("Order date cannot be empty!");
                }

                const orderDate = new Date(order.orderDate);
                const today = new Date();
                if (orderDate.valueOf() > today.valueOf()) {
                    return new BadRequestError("Order date cannot be after today's date");
                }
            }

            return await ordersRepository.update(id, order);
        } catch (error) {
            logger.error("Error while updating order", error);
            return new InternalServerErrorError("Error while updating order", error.stack);
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

const filterOrdersByUser = async (list, userEmail: string) => {
    const user = await userRepository.findByEmail(userEmail);
    return list.filter(order => {
        if (user.role === Role.ADMIN) {
            return order;
        } else if (user.email === order.userEmail) {
            return order;
        }
    });
}

export const ordersService = new OrdersService();