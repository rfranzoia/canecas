import {getRepository} from "typeorm";
import {ResponseData} from "../controller/ResponseData";
import {StatusCodes} from "http-status-codes";
import {Orders} from "../entity/Orders";
import { v4 as uuid } from 'uuid';

export class OrdersService {

    async count(pageSize:number):(Promise<ResponseData>) {
        const count = await getRepository(Orders).count();
        return new ResponseData(StatusCodes.OK, "", { totalNumberOfRecords: count,
            pageSize: pageSize,
            totalNumberOfPages: Math.floor(count / pageSize) + (count % pageSize == 0? 0: 1)});
    }

    async list(pageNumber:number, pageSize:number):(Promise<ResponseData>) {
        const list = await getRepository(Orders).find({
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
        const order = await getRepository(Orders).findOne({id});
        if (!order) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Nenhum pedido encontraddo!");
        }
        return new ResponseData(StatusCodes.OK, "", order);
    }

    async create(user: number):(Promise<ResponseData>) {
        const order = await getRepository(Orders).create({
            user
        });
        await getRepository(Orders).save(order);
        return new ResponseData(StatusCodes.CREATED, "", order);
    }

}