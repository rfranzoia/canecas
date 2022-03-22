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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPrices = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
const Products_1 = require("./Products");
let ProductPrices = class ProductPrices {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductPrices.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Products_1.Products),
    (0, typeorm_2.JoinColumn)({ name: "product_id" }),
    __metadata("design:type", Products_1.Products)
], ProductPrices.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductPrices.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductPrices.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "valid_from",
        type: "date"
    }),
    __metadata("design:type", Date)
], ProductPrices.prototype, "validFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "valid_to",
        type: "date"
    }),
    __metadata("design:type", Date)
], ProductPrices.prototype, "validTo", void 0);
ProductPrices = __decorate([
    (0, typeorm_1.Entity)("product_prices")
], ProductPrices);
exports.ProductPrices = ProductPrices;
//# sourceMappingURL=ProductPrices.js.map