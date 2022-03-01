import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { v4 as uuid } from 'uuid';
import {Orders} from "./Orders";
import {Products} from "./Products";

@Entity("order_items")
export class OrderItems {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Orders)
    @JoinColumn({name:"order_id"})
    order: Orders;

    @Column()
    order_id: uuid;

    @ManyToOne(() => Products)
    @JoinColumn({name:"product_id"})
    product: Products;

    @Column()
    product_id: number;

    @Column()
    quantity: number;

    @Column()
    price: number;

    @Column()
    discount: number;
}