import {Router} from "express";
import {OrdersController} from "../controller/orders/OrdersController";

const ordersController = new OrdersController();
const ordersRouter = Router();

ordersRouter.get("/", ordersController.list);
ordersRouter.get("/:id", ordersController.get);
ordersRouter.get("/count", ordersController.count);

ordersRouter.post("/", ordersController.create);
ordersRouter.put("/:id", ordersController.update);
ordersRouter.delete("/:id", ordersController.delete);

/*
ordersRouter.get("/status/:fruit_status", fruitsController.listByStatus);
ordersRouter.post("/:id", fruitsController.addRemoveFruitItems);

ordersRouter.get("/from/:start_date/to/:end_date", fruitsController.listByDateRange);
ordersRouter.get("/history/:id", fruitsController.listFruitHistoryByFruitId);
 */

export default ordersRouter;