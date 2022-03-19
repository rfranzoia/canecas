import {ProductTypesController} from "../controller/Products/ProductTypesController";
import {Router} from "express";

const productTypesController = new ProductTypesController();
const productTypeRouter = Router();

productTypeRouter.get("/", productTypesController.list);
productTypeRouter.get("/prices", productTypesController.listProductTypesWithMinPricesAvailable);
productTypeRouter.post("/", productTypesController.create);
productTypeRouter.get("//count", productTypesController.count);

productTypeRouter.get("/:id", productTypesController.get);
productTypeRouter.delete("/:id", productTypesController.delete);
productTypeRouter.put("/:id", productTypesController.update);

export default productTypeRouter;