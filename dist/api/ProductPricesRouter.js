"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductPriceController_1 = require("../controller/Products/ProductPriceController");
const express_1 = require("express");
const productPriceController = new ProductPriceController_1.ProductPriceController();
const productPricesRouter = (0, express_1.Router)();
productPricesRouter.post("/add", productPriceController.createAll);
productPricesRouter.post("/", productPriceController.create);
productPricesRouter.get("/", productPriceController.list);
productPricesRouter.get("/product/:productId", productPriceController.listByProduct);
productPricesRouter.get("/productType/:productTypeId", productPriceController.listDistinctProductTypePrices);
productPricesRouter.delete("/:id", productPriceController.delete);
productPricesRouter.delete("/product/:productId", productPriceController.deleteByProduct);
exports.default = productPricesRouter;
//# sourceMappingURL=ProductPricesRouter.js.map