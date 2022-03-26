import helmet from "helmet";
import cors from "cors";
import morgan from 'morgan';
import express, {Router} from "express";
import productTypeRouter from "./ProductTypeRouter";
import productRouter from "./ProductsRouter";
import usersRouter from "./UsersRouter";
import ordersRouter from "./OrdersRouter";
import {TokenService} from "../security/TokenService";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

app.get('/', (req, res) => {
    res.send({
        message: "Canecas-service API"
    });
});

const api = Router();

api.use("/users", usersRouter);
api.use("/productTypes", productTypeRouter);
api.use("/products", productRouter);
api.use("/orders", TokenService.getInstance().authenticateToken, ordersRouter);

app.use("/api", api);
export default app;