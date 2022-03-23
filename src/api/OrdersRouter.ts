import {OrdersController} from "../controller/Orders/OrdersController";
import {Router} from "express";
import {TokenService} from "../security/TokenService";

const ordersController = new OrdersController();
const ordersRouter = Router();
const tokenService = TokenService.getInstance();

ordersRouter.get("/", tokenService.authenticateToken, ordersController.list);
ordersRouter.get("/user/:user_id/status/:order_status", tokenService.authenticateToken, ordersController.listByUserAndStatus);
ordersRouter.get("/user/:user_id", tokenService.authenticateToken, ordersController.listByUserAndStatus);
ordersRouter.get("/count", tokenService.authenticateToken, ordersController.count);
ordersRouter.get("/:id", tokenService.authenticateToken, ordersController.get);
ordersRouter.get("/from/:start_date/to/:end_date", tokenService.authenticateToken, ordersController.listByDateRange);

ordersRouter.post("/", ordersController.create);
ordersRouter.post("/:id", ordersController.addRemoveOrderItems);

ordersRouter.put("/:id", tokenService.authenticateToken, ordersController.updateStatus);

export default ordersRouter;