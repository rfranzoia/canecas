"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductTypeRouter_1 = __importDefault(require("./ProductTypeRouter"));
const ProductsRouter_1 = __importDefault(require("./ProductsRouter"));
const ProductPricesRouter_1 = __importDefault(require("./ProductPricesRouter"));
const UsersRouter_1 = __importDefault(require("./UsersRouter"));
const OrdersRouter_1 = __importDefault(require("./OrdersRouter"));
const TokenService_1 = require("../security/TokenService");
const api = (0, express_1.Router)();
api.use("/users", UsersRouter_1.default);
api.use("/productTypes", TokenService_1.TokenService.getInstance().authenticateToken, ProductTypeRouter_1.default);
api.use("/products", TokenService_1.TokenService.getInstance().authenticateToken, ProductsRouter_1.default);
api.use("/productPrices", TokenService_1.TokenService.getInstance().authenticateToken, ProductPricesRouter_1.default);
api.use("/orders", TokenService_1.TokenService.getInstance().authenticateToken, OrdersRouter_1.default);
exports.default = api;
//# sourceMappingURL=api.js.map