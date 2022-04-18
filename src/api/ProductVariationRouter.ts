import {Router} from "express";
import {TokenService} from "../security/TokenService";
import {ProductVariationController} from "../controller/products/ProductVariationController";

const productVariationController = new ProductVariationController();
const productVariationRouter = Router();

const tokenService = TokenService.getInstance();

productVariationRouter.get("/", productVariationController.list);
productVariationRouter.get("/count", productVariationController.count);
productVariationRouter.get("/:id", productVariationController.get);
productVariationRouter.get("/product/:product/drawings/:drawings/background/:background", productVariationController.listByProductDrawingsBackground);

productVariationRouter.post("/", tokenService.authenticateToken, productVariationController.create);
productVariationRouter.delete("/:id", tokenService.authenticateToken, productVariationController.delete);
productVariationRouter.put("/:id", tokenService.authenticateToken, productVariationController.update);

export default productVariationRouter;