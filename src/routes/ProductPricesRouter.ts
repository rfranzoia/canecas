import {ProductPriceController} from "../controller/ProductPriceController";
import {Router} from "express";

const productPriceController = new ProductPriceController();
const productPricesRouter = Router();

productPricesRouter.post("/add", productPriceController.createAll);
productPricesRouter.post("/", productPriceController.create);

productPricesRouter.get("/", productPriceController.list);
productPricesRouter.get("/product/:productId", productPriceController.listByProduct);
productPricesRouter.get("/productType/:productTypeId", productPriceController.listDistinctProductTypePrices);

productPricesRouter.delete("/:id", productPriceController.delete);
productPricesRouter.delete("/product/:productId", productPriceController.deleteByProduct);

export default productPricesRouter;