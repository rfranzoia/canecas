import {ProductTypesController} from "../controller/Products/ProductTypesController";
import {Router} from "express";
import {TokenService} from "../security/TokenService";

const productTypesController = new ProductTypesController();
const productTypeRouter = Router();

const tokenService = TokenService.getInstance();

productTypeRouter.get("/", productTypesController.list);
productTypeRouter.get("/count", productTypesController.count);
productTypeRouter.get("/:id", productTypesController.get);
productTypeRouter.get("/description/:description", productTypesController.getByDescription);

productTypeRouter.post("/", tokenService.authenticateToken, productTypesController.create);
productTypeRouter.delete("/:id", tokenService.authenticateToken, productTypesController.delete);
productTypeRouter.put("/:id", tokenService.authenticateToken, productTypesController.update);

export default productTypeRouter;