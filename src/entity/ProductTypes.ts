import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("product_types")
export class ProductTypes {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

}