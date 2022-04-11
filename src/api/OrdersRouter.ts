import {Router} from "express";
import {OrdersController} from "../controller/orders/OrdersController";

const ordersController = new OrdersController();
const ordersRouter = Router();

ordersRouter.get("/", ordersController.list);
ordersRouter.get("/count", ordersController.count);
ordersRouter.get("/:id", ordersController.get);
ordersRouter.get("/from/:start_date/to/:end_date", ordersController.listByDateRange);

ordersRouter.post("/", ordersController.create);
ordersRouter.put("/:id", ordersController.update);
ordersRouter.delete("/:id", ordersController.delete);

export default ordersRouter;