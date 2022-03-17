import {Router} from "express";
import productTypeRouter from "./routes/ProductTypeRouter";
import productRouter from "./routes/ProductsRouter";
import productPricesRouter from "./routes/ProductPricesRouter";
import usersRouter from "./routes/UsersRouter";
import ordersRouter from "./routes/OrdersRouter";

const api = Router();

api.use("/productTypes", productTypeRouter);
api.use("/products", productRouter);
api.use("/productPrices", productPricesRouter);
api.use("/users", usersRouter);
api.use("/orders", ordersRouter);

export default api;