"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const ResponseData_1 = require("../../controller/ResponseData");
const http_status_codes_1 = require("http-status-codes");
const UserDTO_1 = require("../../controller/Users/UserDTO");
const UserRepository_1 = require("../../domain/Users/UserRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const TokenService_1 = require("../../security/TokenService");
class UsersService {
    async count() {
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", UserRepository_1.UserRepository.getInstance().count());
    }
    async list(skip, limit) {
        const list = await UserRepository_1.UserRepository.getInstance().find(skip, limit);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", UserDTO_1.UserDTO.mapToListDTO(list));
    }
    async listByRole(role, skip, limit) {
        const list = await UserRepository_1.UserRepository.getInstance().findByRole(role, skip, limit);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", UserDTO_1.UserDTO.mapToListDTO(list));
    }
    async get(id) {
        const user = await UserRepository_1.UserRepository.getInstance().findById(id);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", UserDTO_1.UserDTO.mapToDTO(user));
    }
    async getByEmail(email) {
        const user = await UserRepository_1.UserRepository.getInstance().findByEmail(email);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", UserDTO_1.UserDTO.mapToDTO(user));
    }
    async create({ role, name, email, password, phone, address }) {
        if (await UserRepository_1.UserRepository.getInstance().findByEmail(email)) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.BAD_REQUEST, "Email informado já está cadastrado");
        }
        try {
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const ucr = {
                role: role,
                email: email,
                password: hashedPassword,
                name: name,
                phone: phone,
                address: address
            };
            const user = await UserRepository_1.UserRepository.getInstance()
                .findById((await UserRepository_1.UserRepository.getInstance()
                .create(ucr)).id);
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.CREATED, "", UserDTO_1.UserDTO.mapToDTO(user));
        }
        catch (e) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Ocorreu um problema ao criar o Usuário", e);
        }
    }
    async delete(id, authUser) {
        if (authUser.role !== Role.ADMIN) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.FORBIDDEN, "Você não está autorizado a excluir usuários");
        }
        const user = await UserRepository_1.UserRepository.getInstance().findById(id);
        if (!user) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Usuário não existe");
        }
        await UserRepository_1.UserRepository.getInstance().delete(id);
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NO_CONTENT, "Usuário removido com Sucesso!");
    }
    async update(id, { name, phone, address }) {
        const user = await UserRepository_1.UserRepository.getInstance().findById(id);
        if (!user) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.NOT_FOUND, "Usuário não existe");
        }
        return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "usuário atualizado com Sucesso!", UserDTO_1.UserDTO.mapToDTO(await UserRepository_1.UserRepository.getInstance()
            .update(id, { name, phone, address })));
    }
    async updatePassword(email, old_password, new_password, authUser) {
        const user = await UserRepository_1.UserRepository.getInstance().findByEmail(email);
        if (!user) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Usuário/Senha invalido(s)");
        }
        if (authUser.email !== user.email && authUser.role !== Role.ADMIN) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.FORBIDDEN, "Você não está autorizado a alterar senhas de outro(s) usuário(s)");
        }
        try {
            if (!await bcrypt_1.default.compare(old_password.trim(), user.password.trim())) {
                return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Usuário/Senha invalido(s)");
            }
            const hashedPassword = await bcrypt_1.default.hash(new_password, 10);
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "Senha atualizada", UserDTO_1.UserDTO.mapToDTO(await UserRepository_1.UserRepository.getInstance()
                .updatePassword(user.id, hashedPassword)));
        }
        catch (e) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Ocorreu um problema ao atualizar a senha", e);
        }
    }
    async authenticate(email, password) {
        const user = await UserRepository_1.UserRepository.getInstance().findByEmail(email);
        if (!user) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Usuário/Senha invalido(s)");
        }
        try {
            if (!await bcrypt_1.default.compare(password, user.password)) {
                return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Usuário/Senha invalido(s)");
            }
            const loggedUser = UserDTO_1.UserDTO.mapToDTO(user);
            loggedUser.authToken = TokenService_1.TokenService.getInstance().generateToken({ email: user.email, name: user.name });
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.OK, "", loggedUser);
        }
        catch (e) {
            return new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Usuário/Senha invalido(s)");
        }
    }
}
exports.UsersService = UsersService;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["GUEST"] = "GUEST";
})(Role || (Role = {}));
//# sourceMappingURL=UsersService.js.map