import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {ProductTypes} from "./ProductTypes";
import {JoinColumn} from "typeorm";

@Entity("products")
export class Products {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    image: string;

    @ManyToOne(() => ProductTypes)
    @JoinColumn({name:"product_type_id"})
    productType: ProductTypes;

    @Column()
    product_type_id: number;

}