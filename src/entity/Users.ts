import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity("users")
export class Users {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    role: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;

    @Column()
    address: string;

}