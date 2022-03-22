"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductTypesController_1 = require("../controller/Products/ProductTypesController");
const express_1 = require("express");
const productTypesController = new ProductTypesController_1.ProductTypesController();
const productTypeRouter = (0, express_1.Router)();
productTypeRouter.get("/", productTypesController.list);
productTypeRouter.get("/prices", productTypesController.listProductTypesWithMinPricesAvailable);
productTypeRouter.post("/", productTypesController.create);
productTypeRouter.get("//count", productTypesController.count);
productTypeRouter.get("/:id", productTypesController.get);
productTypeRouter.delete("/:id", productTypesController.delete);
productTypeRouter.put("/:id", productTypesController.update);
exports.default = productTypeRouter;
//# sourceMappingURL=ProductTypeRouter.js.map