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

    async count(pageSize: number):  Promise<{totalNumberOfRecords: number, pageSize: number, totalNumberOfPages: number}> {
        const count = await this.repository.count();
        return { totalNumberOfRecords: count,
                 pageSize: pageSize,
                 totalNumberOfPages: Math.floor(count / pageSize) + (count % pageSize == 0? 0: 1)}
    }

    async findById(id: number): Promise<Users> {
        return await this.repository.findOne({
            where: { id: id }});
    }

    async findByEmail(email: string): Promise<Users> {
        return await this.repository.findOne({
            where: { email: email }});
    }

    async find(pageNumber: number, pageSize: number): Promise<Users[]> {
        return await this.repository.find({
            skip: pageNumber * pageSize,
            take: pageSize,
            order: { name: "ASC" }});
    }

    async findByRole(role: string, pageNumber: number, pageSize: number): Promise<Users[]> {
        return await this.repository.find({
            skip: pageNumber * pageSize,
            take: pageSize,
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