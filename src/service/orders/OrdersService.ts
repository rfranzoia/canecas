import logger from "../../utils/Logger";
import NotFoundError from "../../utils/errors/NotFoundError";
import BadRequestError from "../../utils/errors/BadRequestError";
import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import {Order, OrderItem} from "../../domain/orders/Orders";
import {ordersRepository} from "../../domain/orders/OrdersRepository";
import {userRepository} from "../../domain/Users/UsersRepository";
import {productRepository} from "../../domain/products/ProductRepository";

class OrdersService {

    async count() {
        return await ordersRepository.count();
    }

    async list() {
        return await ordersRepository.findAll();
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

    async update(id: string, order: Order) {
        try {
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