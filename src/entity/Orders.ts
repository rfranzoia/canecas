import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { v4 as uuid } from 'uuid';
import {Users} from "./Users";

@Entity("orders")
export class Orders {

    @PrimaryGeneratedColumn()
    id: uuid;

    @ManyToOne(() => Users)
    @JoinColumn({name:"user_id"})
    user: Users;

    @Column()
    user_id: number;

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