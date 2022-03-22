"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const Users_1 = require("../Users/Users");
let Orders = class Orders {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", typeof (_a = typeof uuid_1.v4 !== "undefined" && uuid_1.v4) === "function" ? _a : Object)
], Orders.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", Users_1.Users)
], Orders.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Orders.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "order_date",
        type: "time with time zone"
    }),
    __metadata("design:type", Date)
], Orders.prototype, "orderDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "order_status",
        type: "character",
        length: 1
    }),
    __metadata("design:type", String)
], Orders.prototype, "orderStatus", void 0);
Orders = __decorate([
    (0, typeorm_1.Entity)("orders")
], Orders);
exports.Orders = Orders;
//# sourceMappingURL=Orders.js.map