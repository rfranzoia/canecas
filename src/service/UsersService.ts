import {getRepository} from "typeorm";
import {ResponseData} from "../controller/ResponseData";
import {StatusCodes} from "http-status-codes";
import {Users} from "../entity/Users";

export class UsersService {

    repository = getRepository(Users);

    decode = (str: string):string => Buffer.from(str, 'base64').toString('binary');
    encode = (str: string):string => Buffer.from(str, 'binary').toString('base64');

    async count(pageSize:number): (Promise<ResponseData>) {
        const count = await this.repository.count();
        return new ResponseData(StatusCodes.OK, "", { totalNumberOfRecords: count,
            pageSize: pageSize,
            totalNumberOfPages: Math.floor(count / pageSize) + (count % pageSize == 0? 0: 1)});
    }

    async list(pageNumber:number, pageSize:number): (Promise<ResponseData>) {
        const list = await this.repository.find({
            skip: pageNumber * pageSize,
            take: pageSize,
            order: {
                name: "ASC"
            }
        });
        const users = list.map(user => new User(user.userType,
            user.name,
            user.email,
            user.phone,
            user.address));
        return new ResponseData(StatusCodes.OK, "", users);
    }

    async listByUserType(userType: string): Promise<ResponseData> {
        const list = await this.repository.find({
            order: {
                name: "ASC"
            },
            where: {
                userType: userType
            }
        });
        const users = list.map(user => new User(user.userType,
            user.name,
            user.email,
            user.phone,
            user.address));
        return new ResponseData(StatusCodes.OK, "", users);
    }

    async create({userType, name, email, phone, address}: UsersCreateRequest): (Promise<ResponseData>) {
        if (await this.repository.findOne({email})) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "Email Já cadastrado!");
        }

        const user = await this.repository.create({
            userType,
            name,
            email,
            phone,
            address
        });

        await this.repository.save(user);
        return new ResponseData(StatusCodes.OK, "", user);
    }

    async get(id: number): (Promise<ResponseData>) {
        const user = await this.repository.findOne(id);
        if (!user) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Não existe um usuário com o ID informado!");
        }
        const u = new User(user.userType,
            user.name,
            user.email,
            user.phone,
            user.address);
        return new ResponseData(StatusCodes.OK, "", u);
    }

    async getByEmail(email: string): (Promise<ResponseData>) {
        const user = await this.repository.findOne({email: email});
        if (!user) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Não existe um usuário com o Email informado!");
        }
        const u = new User(user.userType,
            user.name,
            user.email,
            user.phone,
            user.address);
        return new ResponseData(StatusCodes.OK, "", u);
    }

    async delete(id: number): (Promise<ResponseData>) {
        const user = await this.repository.findOne(id);
        if (!user) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Não existe um usuário com o ID informado!");
        }
        await this.repository.delete({id});
        return new ResponseData(StatusCodes.OK, "Usuário removido com sucesso!", user);
    }

    async update(id: number, {name, phone, address}: UsersUpdateRequest): (Promise<ResponseData>) {
        const user = await this.repository.findOne(id);
        if (!user) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Não existe um usuário com o ID informado!");
        }

        user.name = name? name: user.name;
        user.phone = phone? phone: user.phone;
        user.address = address? address: user.address;

        await this.repository.save(user);

        const u = new User(user.userType,
            user.name,
            user.email,
            user.phone,
            user.address);

        return new ResponseData(StatusCodes.OK, "Usuário atualizado com sucesso!", u);
    }

    async updatePassword(email: string, password: string): (Promise<ResponseData>) {
        const user = await this.repository.findOne({email: email});
        if (!user) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Não existe um usuário com o Email informado!");
        }

        user.password = password? this.encode(password): user.password;
        await this.repository.save(user);

        return new ResponseData(StatusCodes.OK, "Password atualizada com sucesso!");
    }

    async login(email: string, password: string): (Promise<ResponseData>) {
        const user = await this.repository.findOne({email: email});
        if (!user) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "Email e/ou Password incorreto(s)!");
        }

        if (this.decode(user.password) === this.decode(password)) {
            const u = new User(user.userType,
                user.name,
                user.email,
                user.phone,
                user.address);
            return new ResponseData(StatusCodes.OK, "Logged In!!!", u);
        }

        return new ResponseData(StatusCodes.BAD_REQUEST, "Email e/ou Password incorreto(s)!");
    }

}

export type UsersCreateRequest = {
    userType: string,
    name: string,
    email: string,
    phone: string,
    address: string
}

export type UsersUpdateRequest = {
    name: string,
    phone: string,
    address: string
}

class User {
    userType: string;
    name: string;
    email: string;
    phone: string;
    address: string;

    constructor(userType, name, email, phone, address) {
        this.userType = userType;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }
}