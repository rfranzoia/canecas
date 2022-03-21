import {Router} from "express";
import productTypeRouter from "./ProductTypeRouter";
import productRouter from "./ProductsRouter";
import productPricesRouter from "./ProductPricesRouter";
import usersRouter from "./UsersRouter";
import ordersRouter from "./OrdersRouter";
import {TokenService} from "../security/TokenService";

const api = Router();

api.use("/users", usersRouter);
api.use("/productTypes", TokenService.getInstance().authenticateToken, productTypeRouter);
api.use("/products", TokenService.getInstance().authenticateToken, productRouter);
api.use("/productPrices", TokenService.getInstance().authenticateToken, productPricesRouter);
api.use("/orders", TokenService.getInstance().authenticateToken, ordersRouter);

export default api;