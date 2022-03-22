"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
class UserRepository {
    constructor() {
        this.repository = (0, typeorm_1.getRepository)(Users_1.Users);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserRepository();
        }
        return this.instance;
    }
    async count() {
        return await this.repository.count();
    }
    async findById(id) {
        return await this.repository.findOne({
            where: { id: id }
        });
    }
    async findByEmail(email) {
        return await this.repository.findOne({
            where: { email: email }
        });
    }
    async find(skip, limit) {
        return await this.repository.find({
            skip: skip,
            take: limit,
            order: { name: "ASC" }
        });
    }
    async findByRole(role, skip, limit) {
        return await this.repository.find({
            skip: skip,
            take: limit,
            where: { role: role }
        });
    }
    async create(userRequest) {
        const user = await this.repository.create({
            role: userRequest.role,
            name: userRequest.name,
            email: userRequest.email,
            password: userRequest.password,
            phone: userRequest.phone,
            address: userRequest.address
        });
        await this.repository.save(user);
        return user;
    }
    async delete(id) {
        await this.repository.delete({ id });
    }
    async update(id, userRequest) {
        const user = await this.findById(id);
        user.name = userRequest.name ? userRequest.name : user.name;
        user.phone = userRequest.phone ? userRequest.phone : user.phone;
        user.address = userRequest.address ? userRequest.address : user.address;
        await this.repository.save(user);
        return user;
    }
    async updatePassword(id, password) {
        const user = await this.findById(id);
        user.password = password;
        await this.repository.save(user);
        return user;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map