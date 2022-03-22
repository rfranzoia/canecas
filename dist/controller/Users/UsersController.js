"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const UsersService_1 = require("../../service/Users/UsersService");
const PaginationService_1 = require("../../service/PaginationService");
class UsersController {
    async count(request, response) {
        const result = await UsersController.getService().count();
        response.status(result.statusCode).send(result);
    }
    async list(request, response) {
        const { skip, limit } = await PaginationService_1.PaginationService.getInstance().getPagination(request.query);
        const result = await UsersController.getService().list(skip, limit);
        response.status(result.statusCode).send(result);
    }
    async listByUserRole(request, response) {
        const { skip, limit } = await PaginationService_1.PaginationService.getInstance().getPagination(request.query);
        const { role } = request.params;
        const result = await UsersController.getService().listByRole(role, skip, limit);
        response.status(result.statusCode).send(result);
    }
    async get(request, response) {
        const { id } = request.params;
        const result = await UsersController.getService().get(Number(id));
        response.status(result.statusCode).send(result);
    }
    async getByEmail(request, response) {
        const { email } = request.params;
        const result = await UsersController.getService().getByEmail(email);
        response.status(result.statusCode).send(result);
    }
    async create(request, response) {
        const { role, name, email, password, phone, address } = request.body;
        const result = await UsersController.getService().create({ role, name, email, password, phone, address });
        response.status(result.statusCode).send(result);
    }
    async delete(request, response) {
        const authUser = request["user"];
        const { id } = request.params;
        const result = await UsersController.getService().delete(Number(id), authUser);
        response.status(result.statusCode).send(result);
    }
    async update(request, response) {
        const { id } = request.params;
        const { name, phone, address } = request.body;
        const result = await UsersController.getService().update(Number(id), { name, phone, address });
        response.status(result.statusCode).send(result);
    }
    async updatePassword(request, response) {
        const authUser = request["user"];
        const { email, old_password, new_password } = request.body;
        const result = await UsersController.getService().updatePassword(email, old_password, new_password, authUser);
        response.status(result.statusCode).send(result);
    }
    async login(request, response) {
        const { email, password } = request.body;
        const result = await UsersController.getService().authenticate(email, password);
        response.status(result.statusCode).send(result);
    }
}
exports.UsersController = UsersController;
_a = UsersController;
UsersController.getService = () => {
    if (!_a.service) {
        UsersController.service = new UsersService_1.UsersService();
    }
    return UsersController.service;
};
//# sourceMappingURL=UsersController.js.map