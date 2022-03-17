import {OrdersController} from "../controller/OrdersController";
import {Router} from "express";

const ordersController = new OrdersController();
const ordersRouter = Router();

ordersRouter.get("/", ordersController.list);
ordersRouter.get("/user/:user_id/status/:order_status", ordersController.listByUserAndStatus);
ordersRouter.get("/user/:user_id", ordersController.listByUserAndStatus);
ordersRouter.get("/count", ordersController.count);
ordersRouter.get("/:id", ordersController.get);
ordersRouter.get("/from/:start_date/to/:end_date", ordersController.listByDateRange);

ordersRouter.post("/", ordersController.create);
ordersRouter.post("/:id", ordersController.addRemoveOrderItems);

ordersRouter.put("/:id", ordersController.updateStatus);

export default ordersRouter;