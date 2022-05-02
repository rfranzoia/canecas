import { Order, OrdersModel } from "../domain/Orders";
import logger from "../utils/Logger";
import { DefaultRepository } from "./DefaultRepository";

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

}

export const ordersRepository = new OrdersRepository();
