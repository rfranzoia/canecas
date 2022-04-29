import bodyParser from "body-parser";
import cors from "cors";
import express, { Router } from "express";
import morgan from 'morgan';
import swaggerUi from "swagger-ui-express";
import { TokenService } from "../security/TokenService";
import errorRouter from "./ErrorRouter";
import ordersRouter from "./OrdersRouter";
import productRouter from "./ProductsRouter";
import productVariationRouter from "./ProductVariationRouter";
import servicesRouter from "./ServicesRouter";
import swaggerDocument from "./swagger.json";
import usersRouter from "./UsersRouter";

const app = express();
app.use(cors());

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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

const api = Router();

api.use("/errors", errorRouter);
api.use("/users", usersRouter);
api.use("/products", productRouter);
api.use("/productVariations", productVariationRouter);
api.use("/orders", TokenService.getInstance().authenticateToken, ordersRouter);
api.use("/services", TokenService.getInstance().authenticateToken, servicesRouter);

app.use("/api", api);

export default app;