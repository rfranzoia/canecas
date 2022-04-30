import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import logger from "../../utils/Logger";
import { DefaultRepository } from "../DefaultRepository";
import { Order, OrdersModel, OrderStatus } from "./Orders";

class OrdersRepository extends DefaultRepository<Order> {

    constructor() {
        super(OrdersModel);
    }

    async findByFilter(filter: object, skip: number, limit: number) {
        try {
            return await this.model.find(filter, {
                '__v': 0, 'password': 0,
            }).skip(skip)
                .limit(limit)
                .sort({ createdAt: "desc", orderDate: "desc" });
        } catch (error) {
            logger.error(error);
        }
    }

    async create(order: Order) {
        try {
            const o = await OrdersModel.create({
                orderDate: order.orderDate,
                userEmail: order.userEmail,
                status: OrderStatus.QUOTE_REQUEST,
                totalPrice: order.totalPrice,
                items: order.items
            });
            await o.save();
            return o;
        } catch (error) {
            logger.error("Error creating Order", error);
            return new InternalServerErrorError("Error while creating the Order");
        }
    }

    async update(id: string, order: Order) {
        try {
            return await OrdersModel.findOneAndUpdate({ _id: id }, {
                userEmail: order.userEmail,
                orderDate: order.orderDate,
                status: order.status,
                totalPrice: order.totalPrice,
                items: order.items,
                statusHistory: order.statusHistory
            }, { returnOriginal: false });
        } catch (error) {
            logger.error("Error updating Order", error);
            return new InternalServerErrorError(error);
        }
    }

}

export const ordersRepository = new OrdersRepository();
