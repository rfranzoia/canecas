"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductsController_1 = require("../controller/Products/ProductsController");
const express_1 = require("express");
const productsController = new ProductsController_1.ProductsController();
const productRouter = (0, express_1.Router)();
productRouter.post("/", productsController.create);
productRouter.get("/", productsController.list);
productRouter.get("/count", productsController.count);
productRouter.get("/productType/:product_type_id", productsController.listByType);
productRouter.get("/:id", productsController.get);
productRouter.delete("/:id", productsController.delete);
productRouter.put("/:id", productsController.update);
exports.default = productRouter;
//# sourceMappingURL=ProductsRouter.js.map