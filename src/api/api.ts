import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from 'morgan';
import express, {Router} from "express";
import productTypeRouter from "./ProductTypeRouter";
import productRouter from "./ProductsRouter";
import productPricesRouter from "./ProductPricesRouter";
import usersRouter from "./UsersRouter";
import ordersRouter from "./OrdersRouter";
import {TokenService} from "../security/TokenService";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const api = Router();
const tokenService = TokenService.getInstance();

api.use("/users", usersRouter);
api.use("/productTypes", tokenService.authenticateToken, productTypeRouter);
api.use("/products", tokenService.authenticateToken, productRouter);
api.use("/productPrices", tokenService.authenticateToken, productPricesRouter);
api.use("/orders", tokenService.authenticateToken, ordersRouter);

app.use("/api", api);
export default app;