import {Router} from "express";
import {ProductTypesController} from "./ProductTypesController";

const routes = Router();

const productTypesController = new ProductTypesController();

routes.post("/api/productTypes", productTypesController.create);
routes.get("/api/productTypes", productTypesController.list);
routes.get("/api/productTypes/count", productTypesController.count);

routes.get("/api/productTypes/:id", productTypesController.get);
routes.delete("/api/productTypes/:id", productTypesController.delete);
routes.put("/api/productTypes/:id", productTypesController.update);

export { routes };