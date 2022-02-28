import {Router} from "express";
import {ProductTypesController} from "./ProductTypesController";
import {ProductsController} from "./ProductsController";
import {Products} from "../entity/Products";
import {ProductPriceController} from "./ProductPriceController";

const routes = Router();

// ProductTypes
const productTypesController = new ProductTypesController();

routes.post("/api/productTypes", productTypesController.create);
routes.get("/api/productTypes", productTypesController.list);
routes.get("/api/productTypes/count", productTypesController.count);

routes.get("/api/productTypes/:id", productTypesController.get);
routes.delete("/api/productTypes/:id", productTypesController.delete);
routes.put("/api/productTypes/:id", productTypesController.update);


// Products
const productsController = new ProductsController();

routes.post("/api/products", productsController.create);
routes.get("/api/products", productsController.list);
routes.get("/api/products/count", productsController.count);

routes.get("/api/products/:id", productsController.get);
routes.delete("/api/products/:id", productsController.delete);
routes.put("/api/products/:id", productsController.update);

// productPrices
const productPriceController = new ProductPriceController();

routes.post("/api/productPrices/add", productPriceController.createAll);
routes.post("/api/productPrices", productPriceController.create);

routes.get("/api/productPrices", productPriceController.list);
routes.get("/api/productPrices/product/:productId", productPriceController.listByProduct);

routes.delete("/api/productPrices/:id", productPriceController.delete);
routes.delete("/api/productPrices/product/:productId", productPriceController.deleteByProduct);


export { routes };