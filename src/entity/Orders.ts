import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { v4 as uuid } from 'uuid';

@Entity("orders")
export class Orders {

    @PrimaryGeneratedColumn()
    id: uuid;

    @Column({
        name: "user_id",
        type: "bigint"
    })
    user: number;

    @Column({
        name: "order_date",
        type: "time with time zone"
    })
    orderDate: Date;

    @Column({
        name: "order_status",
        type: "character",
        length: 1
    })
    orderStatus: string;

}