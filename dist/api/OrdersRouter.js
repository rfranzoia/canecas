"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OrdersController_1 = require("../controller/Orders/OrdersController");
const express_1 = require("express");
const ordersController = new OrdersController_1.OrdersController();
const ordersRouter = (0, express_1.Router)();
ordersRouter.get("/", ordersController.list);
ordersRouter.get("/user/:user_id/status/:order_status", ordersController.listByUserAndStatus);
ordersRouter.get("/user/:user_id", ordersController.listByUserAndStatus);
ordersRouter.get("/count", ordersController.count);
ordersRouter.get("/:id", ordersController.get);
ordersRouter.get("/from/:start_date/to/:end_date", ordersController.listByDateRange);
ordersRouter.post("/", ordersController.create);
ordersRouter.post("/:id", ordersController.addRemoveOrderItems);
ordersRouter.put("/:id", ordersController.updateStatus);
exports.default = ordersRouter;
//# sourceMappingURL=OrdersRouter.js.map