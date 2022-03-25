import {UserDTO} from "../../controller/Users/UserDTO";
import {UserRepository} from "../../domain/Users/UserRepository";
import bcrypt from "bcrypt";
import {TokenService} from "../../security/TokenService";
import logger from "../../utils/Logger";
import NotFoundError from "../../utils/errors/NotFoundError";
import BadRequestError from "../../utils/errors/BadRequestError";
import InternalServerError from "../../utils/errors/InternalServerError";
import UnauthorizedError from "../../utils/errors/UnauthorizedError";

export class UsersService {

    async count(): Promise<Number> {
        return UserRepository.getInstance().count();
    }

    async list(skip:number, limit:number): Promise<UserDTO[]> {
        const list = await UserRepository.getInstance().find(skip, limit);
        return UserDTO.mapToListDTO(list);
    }

    async listByRole(role: string, skip:number, limit:number): Promise<UserDTO[]> {
        const list = await UserRepository.getInstance().findByRole(role, skip, limit);
        return UserDTO.mapToListDTO(list);
    }

    async get(id:number): Promise<UserDTO | NotFoundError> {
        const user = await UserRepository.getInstance().findById(id);
        if (!user) {
            return new NotFoundError(`Usuário com ID: ${id} não existe`)
        }
        return  UserDTO.mapToDTO(user);
    }

    async getByEmail(email:string): Promise<UserDTO | NotFoundError> {
        const user = await UserRepository.getInstance().findByEmail(email);
        if (!user) {
            return new NotFoundError(`Usuário com e-mail: ${email} não existe`)
        }
        return UserDTO.mapToDTO(user);
    }

    async create({role, name, email, password, phone, address}: UserRequest): Promise<UserDTO | BadRequestError | InternalServerError> {
        if (await UserRepository.getInstance().findByEmail(email)) {
            return new BadRequestError("Email informado já está cadastrado");
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

            return UserDTO.mapToDTO(user);
        } catch (error) {
            logger.error("Error while creating user", error);
            return new InternalServerError("Ocorreu um problema ao criar o Usuário");
        }

    }

    async delete(id: number): Promise<Boolean | NotFoundError> {
        const user = await UserRepository.getInstance().findById(id);
        if (!user) {
            return new NotFoundError(`Usuário com ID: ${id} não existe`)
        }
        await UserRepository.getInstance().delete(id);
        return true;
    }

    async update(id: number, {name, phone, address}: UserRequest): Promise<UserDTO | NotFoundError> {
        const user = await UserRepository.getInstance().findById(id);
        if (!user) {
            return new NotFoundError(`Usuário com ID: ${id} não existe`)
        }
        return UserDTO.mapToDTO(await UserRepository.getInstance().update(id, {name, phone, address}));
    }

    async updatePassword(email: string, old_password: string, new_password: string): Promise<UserDTO | UnauthorizedError | InternalServerError> {
        const user = await UserRepository.getInstance().findByEmail(email);
        if (!user) {
            return new UnauthorizedError("Usuário/senha invalido(s)");
        }
        try {
            if (!await bcrypt.compare(old_password.trim(), user.password.trim())) {
                return new UnauthorizedError("Usuário/senha invalido(s)");
            }

            const hashedPassword = await bcrypt.hash(new_password, 10);
            return UserDTO.mapToDTO(await UserRepository.getInstance().updatePassword(user.id, hashedPassword));

        } catch (error) {
            logger.error("Error while users password", error);
            return new InternalServerError("Ocorreu um problema ao atualizar a senha");
        }
    }

    async authenticate(email: string, password: string): Promise<UserDTO | UnauthorizedError> {
        const user = await UserRepository.getInstance().findByEmail(email);
        if (!user) {
            return new UnauthorizedError("Usuário/senha invalido(s)");
        }

        try {
            if (!await bcrypt.compare(password, user.password)) {
                return new UnauthorizedError("Usuário/senha invalido(s)");
            }

            const loggedUser = UserDTO.mapToDTO(user);
            loggedUser.authToken = TokenService.getInstance().generateToken({ id: user.id, email: user.email, name: user.name });

            return loggedUser;
        } catch (error) {
            logger.error("Invalid username/password error", error);
            return new UnauthorizedError("Usuário/senha invalido(s)");
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
