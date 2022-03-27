import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import logger from "../../utils/Logger";
import {Order, OrdersModel, OrderStatus} from "./Orders";

class OrdersRepository {

    async count() {
        try {
            return await OrdersModel.count({name:"name"});
        } catch (error) {
            logger.error("Error counting documents", error);
            return new InternalServerErrorError("Error counting documents");
        }
    }

    async findAll() {
        return await OrdersModel.find({}, {
            '__v': 0, 'password': 0,
        });
    }

    async findById(id: string) {
        return await OrdersModel.findOne({ _id: id }, { '__v': 0,});
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
            await OrdersModel.deleteOne({ _id: id });
        } catch (error) {
            logger.error("Error deleting Order", error);
            return new InternalServerErrorError("Error while deleting the Order");
        }
    }

    async update(id: string, order: Order) {
        try {
            return await OrdersModel.findOneAndUpdate({ _id: id }, {
                status: order.status,
                totalPrice: order.totalPrice
            }, { returnOriginal: false  });
        } catch (error) {
            logger.error("Error updating Order", error);
            return new InternalServerErrorError(error);
        }
    }

}

export const ordersRepository = new OrdersRepository();
