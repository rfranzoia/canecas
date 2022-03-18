import {ResponseData} from "../dto/ResponseData";
import {StatusCodes} from "http-status-codes";
import {UserDTO} from "../dto/UserDTO";
import {UserRepository} from "../repository/UserRepository";
import bcrypt from "bcrypt";

export type UserCreateRequest = {
    role: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
}

export type UserUpdateRequest = {
    name: string;
    phone: string;
    address: string;
}

export class UsersService {

    async count():(Promise<ResponseData>) {
        return new ResponseData(StatusCodes.OK, "", UserRepository.getInstance().count());
    }

    async list(skip:number, limit:number):(Promise<ResponseData>) {
        const list = await UserRepository.getInstance().find(skip, limit);
        return new ResponseData(StatusCodes.OK, "", UserDTO.mapToListDTO(list));
    }

    async listByRole(role: string, skip:number, limit:number):(Promise<ResponseData>) {
        const list = await UserRepository.getInstance().findByRole(role, skip, limit);
        return new ResponseData(StatusCodes.OK, "", UserDTO.mapToListDTO(list));
    }

    async get(id:number):(Promise<ResponseData>) {
        const user = await UserRepository.getInstance().findById(id);
        return new ResponseData(StatusCodes.OK, "", UserDTO.mapToDTO(user));
    }

    async getByEmail(email:string):(Promise<ResponseData>) {
        const user = await UserRepository.getInstance().findByEmail(email);
        return new ResponseData(StatusCodes.OK, "", UserDTO.mapToDTO(user));
    }

    async create({role, name, email, password, phone, address}: UserCreateRequest):(Promise<ResponseData>) {
        if (await UserRepository.getInstance().findByEmail(email)) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "Email informado já está cadastrado");
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const ucr: UserCreateRequest = {
                role: role,
                name: name,
                email: email,
                password: hashedPassword,
                phone: phone,
                address: address
            }

            const user = await UserRepository.getInstance()
                                    .findById((await UserRepository.getInstance()
                                        .create(ucr)).id);

            return new ResponseData(StatusCodes.CREATED, "", UserDTO.mapToDTO(user));
        } catch (e) {
            return new ResponseData(StatusCodes.INTERNAL_SERVER_ERROR, "Ocorreu um problema ao criar o Usuário", e);
        }

    }

    async delete(id: number, authUser: UserDTO):(Promise<ResponseData>) {
        if (authUser.role !== "ADMIN") {
            return new ResponseData(StatusCodes.FORBIDDEN, "Você não está autorizado a excluir usuários");
        }
        const user = await UserRepository.getInstance().findById(id);
        if (!user) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Usuário não existe");
        }
        await UserRepository.getInstance().delete(id);
        return new ResponseData(StatusCodes.OK, "Usuário removido com Sucesso!", UserDTO.mapToDTO(user));
    }

    async update(id: number, {name, phone, address}: UserUpdateRequest):(Promise<ResponseData>) {
        const user = await UserRepository.getInstance().findById(id);
        if (!user) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Usuário não existe");
        }
        return new ResponseData(StatusCodes.OK, "usuário atualizado com Sucesso!",
                            UserDTO.mapToDTO(await UserRepository.getInstance()
                                                            .update(id, {name, phone, address})));

    }

    async updatePassword(email: string, old_password: string, new_password: string, authUser: UserDTO): Promise<ResponseData> {
        const user = await UserRepository.getInstance().findByEmail(email);
        if (!user) {
            return new ResponseData(StatusCodes.UNAUTHORIZED, "Usuário/Senha invalido(s)");
        }
        if (authUser.email !== user.email && authUser.role !== "ADMIN") {
            return new ResponseData(StatusCodes.FORBIDDEN, "Você não está autorizado a alterar senhas de outro(s) usuário(s)");
        }
        try {
            if (!await bcrypt.compare(old_password.trim(), user.password.trim())) {
                return new ResponseData(StatusCodes.UNAUTHORIZED, "Usuário/Senha invalido(s)");
            }

            const hashedPassword = await bcrypt.hash(new_password, 10);
            return new ResponseData(StatusCodes.OK, "Senha atualizada",
                            UserDTO.mapToDTO(await UserRepository.getInstance()
                                                        .updatePassword(user.id, hashedPassword)));

        } catch (e) {
            return new ResponseData(StatusCodes.INTERNAL_SERVER_ERROR, "Ocorreu um problema ao atualizar a senha", e);
        }
    }

    async authenticate(email: string, password: string): Promise<ResponseData> {
        const user = await UserRepository.getInstance().findByEmail(email);
        if (!user) {
            return new ResponseData(StatusCodes.UNAUTHORIZED, "Usuário/Senha invalido(s)");

        }

        try {
            if (!await bcrypt.compare(password, user.password)) {
                return new ResponseData(StatusCodes.UNAUTHORIZED, "Usuário/Senha invalido(s)");
            }

            return new ResponseData(StatusCodes.OK, "", UserDTO.mapToDTO(user));
        } catch (e) {
            return new ResponseData(StatusCodes.UNAUTHORIZED, "Usuário/Senha invalido(s)");
        }
    }
}