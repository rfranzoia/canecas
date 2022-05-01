import { Router } from "express";
import { OrdersController } from "../controller/OrdersController";

const ordersController = new OrdersController();
const ordersRouter = Router();

ordersRouter.get("/", ordersController.list);
ordersRouter.get("/count", ordersController.count);
ordersRouter.get("/filterBy", ordersController.listByFilter);
ordersRouter.get("/:id", ordersController.get);

ordersRouter.post("/", ordersController.create);
ordersRouter.put("/:id", ordersController.update);
ordersRouter.delete("/:id", ordersController.delete);

export default ordersRouter;
