import {ProductsController} from "../controller/Products/ProductsController";
import {Router} from "express";

const productsController = new ProductsController();
const productRouter = Router();

productRouter.post("/", productsController.create);
productRouter.get("/", productsController.list);
productRouter.get("/count", productsController.count);

productRouter.get("/productType/:product_type_id", productsController.listByType);

productRouter.get("/:id", productsController.get);
productRouter.delete("/:id", productsController.delete);
productRouter.put("/:id", productsController.update);

export default productRouter;