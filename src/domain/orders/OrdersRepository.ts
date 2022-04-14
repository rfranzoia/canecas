import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import logger from "../../utils/Logger";
import {Order, OrdersModel, OrderStatus} from "./Orders";

class OrdersRepository {

    async count(filter: object) {
        return await OrdersModel.count(filter);
    }

    async findAll(filter: object, skip: number, limit: number) {
        return await OrdersModel.find(filter, {
            '__v': 0, 'password': 0,
        }).skip(skip)
          .limit(limit)
          .sort({createdAt: "desc", orderDate: "desc"});
    }

    async findByDateRange(filter, skip: number, limit: number) {
        return await OrdersModel.find(filter, {
            '__v': 0, 'password': 0,
        }).skip(skip)
          .limit(limit);
    }

    async findById(id: string) {
        return await OrdersModel.findOne({_id: id}, {'__v': 0,});
    }

    async create(order: Order) {
        try {
            const o = await OrdersModel.create({
                orderDate: order.orderDate,
                userEmail: order.userEmail,
                status: OrderStatus.NEW,
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

    async delete(id: string) {
        try {
            await OrdersModel.deleteOne({_id: id});
        } catch (error) {
            logger.error("Error deleting Order", error);
            return new InternalServerErrorError("Error while deleting the Order");
        }
    }

    async update(id: string, order: Order) {
        try {
            return await OrdersModel.findOneAndUpdate({_id: id}, {
                userEmail: order.userEmail,
                orderDate: order.orderDate,
                status: order.status,
                totalPrice: order.totalPrice,
                items: order.items,
                statusHistory: order.statusHistory
            }, {returnOriginal: false});
        } catch (error) {
            logger.error("Error updating Order", error);
            return new InternalServerErrorError(error);
        }
    }

}

export const ordersRepository = new OrdersRepository();
