import {ResponseData} from "../../controller/ResponseData";
import {StatusCodes} from "http-status-codes";
import {UserDTO} from "../../controller/Users/UserDTO";
import {UserRepository} from "../../domain/Users/UserRepository";
import bcrypt from "bcrypt";
import {TokenService} from "../../security/TokenService";
import logger from "../../Logger";

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

    async create({role, name, email, password, phone, address}: UserRequest):(Promise<ResponseData>) {
        if (await UserRepository.getInstance().findByEmail(email)) {
            return new ResponseData(StatusCodes.BAD_REQUEST, "Email informado já está cadastrado");
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const ucr: UserRequest = {
                role: role,
                email: email,
                password: hashedPassword,
                name: name,
                phone: phone,
                address: address
            }

            const user = await UserRepository.getInstance()
                                    .findById((await UserRepository.getInstance()
                                        .create(ucr)).id);

            return new ResponseData(StatusCodes.CREATED, "", UserDTO.mapToDTO(user));
        } catch (error) {
            logger.error("Error while creating user", error);
            return new ResponseData(StatusCodes.INTERNAL_SERVER_ERROR, "Ocorreu um problema ao criar o Usuário", error);
        }

    }

    async delete(id: number):(Promise<ResponseData>) {
        const user = await UserRepository.getInstance().findById(id);
        if (!user) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Usuário não existe");
        }
        await UserRepository.getInstance().delete(id);
        return new ResponseData(StatusCodes.NO_CONTENT, "Usuário removido com Sucesso!");
    }

    async update(id: number, {name, phone, address}: UserRequest):(Promise<ResponseData>) {
        const user = await UserRepository.getInstance().findById(id);
        if (!user) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Usuário não existe");
        }
        return new ResponseData(StatusCodes.OK, "usuário atualizado com Sucesso!",
                            UserDTO.mapToDTO(await UserRepository.getInstance()
                                                            .update(id, {name, phone, address})));

    }

    async updatePassword(email: string, old_password: string, new_password: string): Promise<ResponseData> {
        const user = await UserRepository.getInstance().findByEmail(email);
        if (!user) {
            return new ResponseData(StatusCodes.UNAUTHORIZED, "Usuário/Senha invalido(s)");
        }
        try {
            if (!await bcrypt.compare(old_password.trim(), user.password.trim())) {
                return new ResponseData(StatusCodes.UNAUTHORIZED, "Usuário/Senha invalido(s)");
            }

            const hashedPassword = await bcrypt.hash(new_password, 10);
            return new ResponseData(StatusCodes.OK, "Senha atualizada",
                            UserDTO.mapToDTO(await UserRepository.getInstance()
                                                        .updatePassword(user.id, hashedPassword)));

        } catch (error) {
            logger.error("Error while users password", error);
            return new ResponseData(StatusCodes.INTERNAL_SERVER_ERROR, "Ocorreu um problema ao atualizar a senha", error);
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

            const loggedUser = UserDTO.mapToDTO(user);
            loggedUser.authToken = TokenService.getInstance().generateToken({ id: user.id, email: user.email, name: user.name });

            return new ResponseData(StatusCodes.OK, "", loggedUser);
        } catch (error) {
            logger.error("Invalid username/password error", error);
            return new ResponseData(StatusCodes.UNAUTHORIZED, "Usuário/Senha invalido(s)");
        }
    }
}

export enum Role { ADMIN = "ADMIN", USER = "USER", GUEST = "GUEST"}

export interface UserRequest {
    role?: string;
    email?: string;
    password?: string;
    name: string;
    phone: string;
    address: string;
}
