import {Router} from "express";
import {TokenService} from "../security/TokenService";
import {TypesController} from "../controller/products/TypesController";

const typesController = new TypesController();
const typeRouter = Router();

const tokenService = TokenService.getInstance();

typeRouter.get("/", typesController.list);
typeRouter.get("/count", typesController.count);
typeRouter.get("/:id", typesController.get);
typeRouter.get("/description/:description", typesController.findByDescription);

typeRouter.post("/", tokenService.authenticateToken, typesController.create);
typeRouter.delete("/:id", tokenService.authenticateToken, typesController.delete);
typeRouter.put("/:id", tokenService.authenticateToken, typesController.update);

export default typeRouter;
