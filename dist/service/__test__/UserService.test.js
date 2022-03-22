"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const UsersService_1 = require("../Users/UsersService");
require("../../database");
const Connections_1 = __importDefault(require("./Connections"));
beforeAll(async () => {
    await Connections_1.default.create();
});
afterAll(async () => {
    await Connections_1.default.close();
});
describe("Users Service Test", () => {
    test("List Users", async () => {
        const service = new UsersService_1.UsersService();
        const users = (await service.list(0, 0)).data;
        expect(users.length).toBeGreaterThanOrEqual(1);
    });
});
//# sourceMappingURL=UserService.test.js.map