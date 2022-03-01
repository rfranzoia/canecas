import {getRepository} from "typeorm";
import {ResponseData} from "../controller/ResponseData";
import {StatusCodes} from "http-status-codes";
import {Orders} from "../entity/Orders";
import { v4 as uuid } from 'uuid';

export class OrdersService {

    repository = getRepository(Orders);
    
    async count(pageSize:number):(Promise<ResponseData>) {
        const count = await this.repository.count();
        return new ResponseData(StatusCodes.OK, "", { totalNumberOfRecords: count,
            pageSize: pageSize,
            totalNumberOfPages: Math.floor(count / pageSize) + (count % pageSize == 0? 0: 1)});
    }

    async list(pageNumber:number, pageSize:number):(Promise<ResponseData>) {
        const list = await this.repository.find({
            skip: pageNumber * pageSize,
            take: pageSize,
            order: {
                orderDate: "DESC",
                orderStatus: "DESC"
            }
        });
        return new ResponseData(StatusCodes.OK, "", list);
    }

    async get(id: uuid):(Promise<ResponseData>) {
        const order = await this.repository.findOne({id});
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");
        }
        return new ResponseData(StatusCodes.OK, "", order);
    }

    async create(user_id: number):(Promise<ResponseData>) {
        const order = await this.repository.create({
            user_id
        });
        await this.repository.save(order);
        return new ResponseData(StatusCodes.CREATED, "", order);
    }

    async delete(id: uuid):(Promise<ResponseData>) {
        const order = await this.repository.findOne({id});
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");

        } else if (order.orderStatus !== "0") {
            return new ResponseData(StatusCodes.BAD_REQUEST, "O Pedido informado não pode ser excluido!");
        }
        await this.repository.delete({id});
        return new ResponseData(StatusCodes.OK, "Pedido removido com sucesso!", order);
    }

    // TODO: insert history data after update
    async updateStatus(id: uuid, orderStatus: string):(Promise<ResponseData>) {
        const order = await this.repository.findOne({id});
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontrado!");
        }
        order.orderStatus = orderStatus;
        await this.repository.save(order);
        return new ResponseData(StatusCodes.OK, "Pedido atualizado com sucesso!", order);
    }
}