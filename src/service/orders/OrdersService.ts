import logger from "../../utils/Logger";
import NotFoundError from "../../utils/errors/NotFoundError";
import BadRequestError from "../../utils/errors/BadRequestError";
import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import {Order, OrderItem, OrderStatus, OrderStatusHistory} from "../../domain/orders/Orders";
import {ordersRepository} from "../../domain/orders/OrdersRepository";
import {userRepository} from "../../domain/Users/UsersRepository";
import {productRepository} from "../../domain/products/ProductRepository";
import {Role} from "../../domain/Users/Users";
import {DefaultService} from "../DefaultService";
import {BackgroundType} from "../../domain/products/ProductVariation";

class OrdersService extends DefaultService<Order> {

    constructor() {
        super(ordersRepository, "Order");
    }
    async count(userEmail: string) {
        const user = await userRepository.findByEmail(userEmail);
        if (user.role === Role.ADMIN) {
            return await this.repository.count({});
        } else {
            return await this.repository.count({ userEmail: userEmail });
        }
    }

    async list(userEmail: string, skip: number, limit: number) {
        const user = await userRepository.findByEmail(userEmail);
        if (user.role === Role.ADMIN) {
            return await ordersRepository.findByFilter({}, skip, limit);
        } else {
            return await ordersRepository.findByFilter({userEmail: userEmail}, skip, limit);
        }
    }

    async listByFilter(startDate: string, endDate: string, orderStatus:string, userEmail: string, requestUser:string, skip: number, limit: number) {
        const user = await userRepository.findByEmail(requestUser);
        try {
            let filter = {};
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                if (end < start) {
                    return new BadRequestError("End date must be after start date");
                }
                filter = {
                    orderDate: {
                        $gte: startDate,
                        $lte: endDate
                    },
                }
            }
            if (orderStatus) {
                filter = {
                    ...filter,
                    status: +orderStatus,
                }
            }
            if (userEmail) {
                filter = {
                    ...filter,
                    userEmail: userEmail,
                }
            }
            if (user.role !== Role.ADMIN) {
                filter = {
                    ...filter,
                    userEmail: userEmail,
                }
            }
            return await ordersRepository.findByFilter(filter, skip, limit);
        } catch (error) {
            logger.error(error.stack);
            return new BadRequestError("There was a problem while loading the orders", error.stack);
        }
    }

    async getAsUser(id: string, userEmail: string) {
        const order = await this.repository.findById(id);
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
        } else if (!areItemsValid(order.items)) {
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

    async deleteAsUser(id: string, userEmail: string) {
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

                } else if (!areItemsValid(order.items)) {
                    return new BadRequestError("One or more item is not valid for this order");
                }

                order.totalPrice = order.items.reduce((acc, item) => {
                    return acc + (item.price * item.amount);
                }, 0);

                if (order.userEmail) {
                    if (order.userEmail.trim().length === 0) {
                        return new BadRequestError("User Email cannot be empty!");
                    } else if (!await userRepository.findByEmail(order.userEmail)) {
                        return new BadRequestError("The provided user e-mail is not valid");
                    }
                }

                if (order.orderDate && order.orderDate.toString().trim().length === 0) {
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
            console.error(error.stack);
            logger.error("Error while updating order", error);
            return new InternalServerErrorError("Error while updating order", error.stack);
        }
    }
}

const areItemsValid = (orderItems: OrderItem[]) => {
    for (let i = 0; i < orderItems.length; i++) {
        if (!productRepository.findByName(orderItems[i].product)) {
            return false;

        } else if (!(orderItems[i].background.toUpperCase() in BackgroundType)) {
            return false;

        }else if (orderItems[i].price < 0 || orderItems[i].amount < 0 || orderItems[i].drawings < 0) {
            return false;
        }
    }
    return true;
}

export const ordersService = new OrdersService();