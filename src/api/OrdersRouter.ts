import {OrdersController} from "../controller/Orders/OrdersController";
import {Router} from "express";

const ordersController = new OrdersController();
const ordersRouter = Router();

ordersRouter.post("/", ordersController.create);
ordersRouter.post("/:id", ordersController.addRemoveOrderItems);

ordersRouter.get("/", ordersController.list);
ordersRouter.get("/status/:order_status", ordersController.listByStatus);
ordersRouter.get("/count", ordersController.count);
ordersRouter.get("/:id", ordersController.get);
ordersRouter.get("/from/:start_date/to/:end_date", ordersController.listByDateRange);
ordersRouter.get("/history/:id", ordersController.listOrderHistoryByOrderId);

ordersRouter.put("/:id", ordersController.updateStatus);
ordersRouter.delete("/:id", ordersController.delete)

export default ordersRouter;