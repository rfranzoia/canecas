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
exports.OrdersHistory = void 0;
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const Orders_1 = require("./Orders");
let OrdersHistory = class OrdersHistory {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrdersHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Orders_1.Orders),
    (0, typeorm_1.JoinColumn)({ name: "order_id" }),
    __metadata("design:type", Orders_1.Orders)
], OrdersHistory.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", typeof (_a = typeof uuid_1.v4 !== "undefined" && uuid_1.v4) === "function" ? _a : Object)
], OrdersHistory.prototype, "order_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "change_date",
        type: "timestamp with time zone"
    }),
    __metadata("design:type", Date)
], OrdersHistory.prototype, "changeDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "previous_status",
        type: "character",
        length: 1
    }),
    __metadata("design:type", String)
], OrdersHistory.prototype, "previousStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "current_status",
        type: "character",
        length: 1
    }),
    __metadata("design:type", String)
], OrdersHistory.prototype, "currentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "change_reason",
        type: "varchar",
        length: 300
    }),
    __metadata("design:type", String)
], OrdersHistory.prototype, "changeReason", void 0);
OrdersHistory = __decorate([
    (0, typeorm_1.Entity)("order_history")
], OrdersHistory);
exports.OrdersHistory = OrdersHistory;
//# sourceMappingURL=OrdersHistory.js.map