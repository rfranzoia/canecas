import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { v4 as uuid } from 'uuid';
import {Orders} from "./Orders";
import {Products} from "./Products";

@Entity("order_history")
export class OrdersHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Orders)
    @JoinColumn({name:"order_id"})
    order: Orders;

    @Column()
    order_id: uuid;

    @Column({
        name: "change_date",
        type: "timestamp with time zone"
    })
    changeDate: Date;

    @Column({
        name: "previous_status",
        type: "character",
        length: 1
    })
    previousStatus: string;

    @Column({
        name: "current_status",
        type: "character",
        length: 1
    })
    currentStatus: string;

    @Column({
        name: "change_reason",
        type: "varchar",
        length: 300
    })
    changeReason: string;
}