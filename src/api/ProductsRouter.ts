import {Router} from "express";
import {TokenService} from "../security/TokenService";
import {ProductsController} from "../controller/products/ProductsController";

const productsController = new ProductsController();
const productRouter = Router();

const tokenService = TokenService.getInstance();

productRouter.get("/", productsController.list);
productRouter.get("/count", productsController.count);
productRouter.get("/:id", productsController.get);
productRouter.get("/name/:name", productsController.getByName);

productRouter.post("/", tokenService.authenticateToken, productsController.create);
productRouter.delete("/:id", tokenService.authenticateToken, productsController.delete);
productRouter.put("/:id", tokenService.authenticateToken, productsController.update);

export default productRouter;