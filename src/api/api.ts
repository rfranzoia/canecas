import helmet from "helmet";
import cors from "cors";
import morgan from 'morgan';
import express, {Router} from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import {TokenService} from "../security/TokenService";
import productTypeRouter from "./ProductTypeRouter";
import productRouter from "./ProductsRouter";
import usersRouter from "./UsersRouter";
import ordersRouter from "./OrdersRouter";

const app = express();

app.use(helmet());
app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.use(morgan('[:method] - :date[iso] ":url" :status :response-time ms - :res[content-length]'));

const options = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Canecas Service"
};

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, options)
);

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