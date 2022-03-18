import {getRepository} from "typeorm";
import {Users} from "../entity/Users";
import {UserCreateRequest, UserUpdateRequest} from "../service/UsersService";

export class UserRepository {

    static instance: UserRepository;

    repository = getRepository(Users);

    static getInstance(): UserRepository {
        if (!this.instance) {
            this.instance = new UserRepository();
        }
        return this.instance;
    }

    async count():  Promise<Number> {
        return await this.repository.count();
    }

    async findById(id: number): Promise<Users> {
        return await this.repository.findOne({
            where: { id: id }});
    }

    async findByEmail(email: string): Promise<Users> {
        return await this.repository.findOne({
            where: { email: email }});
    }

    async find(skip: number, limit: number): Promise<Users[]> {
        return await this.repository.find({
            skip: skip,
            take: limit,
            order: { name: "ASC" }});
    }

    async findByRole(role: string, skip: number, limit: number): Promise<Users[]> {
        return await this.repository.find({
            skip: skip,
            take: limit,
            where: { role: role }});
    }

    async create({role, name, email, password, phone, address}: UserCreateRequest): Promise<Users> {

        const user = await this.repository.create({
            role,
            name,
            email,
            password,
            phone,
            address
        });
        await this.repository.save(user);
        return user;
    }

    async delete(id: number) {
        await this.repository.delete({id});
    }

    async update(id: number, {name, phone, address}: UserUpdateRequest): Promise<Users> {
        const user = await this.findById(id);

        user.name = name? name: user.name;
        user.phone = phone? phone: user.phone;
        user.address = address? address: user.address;

        await this.repository.save(user);
        return user;
    }

    async updatePassword(id: number, password: string): Promise<Users> {
        const user = await this.findById(id);

        user.password = password;

        await this.repository.save(user);
        return user;
    }

}