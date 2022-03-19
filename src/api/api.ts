import {Router} from "express";
import productTypeRouter from "./ProductTypeRouter";
import productRouter from "./ProductsRouter";
import productPricesRouter from "./ProductPricesRouter";
import usersRouter from "./UsersRouter";
import ordersRouter from "./OrdersRouter";

const api = Router();

api.use("/productTypes", productTypeRouter);
api.use("/products", productRouter);
api.use("/productPrices", productPricesRouter);
api.use("/users", usersRouter);
api.use("/orders", ordersRouter);

export default api;