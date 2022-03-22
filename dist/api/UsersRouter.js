"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UsersController_1 = require("../controller/Users/UsersController");
const express_1 = require("express");
const TokenService_1 = require("../security/TokenService");
const usersController = new UsersController_1.UsersController();
const usersRouter = (0, express_1.Router)();
usersRouter.get("/", TokenService_1.TokenService.getInstance().authenticateToken, usersController.list);
usersRouter.get("/count", TokenService_1.TokenService.getInstance().authenticateToken, usersController.count);
usersRouter.get("/role/:role", TokenService_1.TokenService.getInstance().authenticateToken, usersController.listByUserRole);
usersRouter.get("/:id", TokenService_1.TokenService.getInstance().authenticateToken, usersController.get);
usersRouter.get("/email/:email", TokenService_1.TokenService.getInstance().authenticateToken, usersController.getByEmail);
usersRouter.delete("/:id", TokenService_1.TokenService.getInstance().authenticateToken, usersController.delete);
usersRouter.put("/:id", TokenService_1.TokenService.getInstance().authenticateToken, usersController.update);
usersRouter.post("/password", TokenService_1.TokenService.getInstance().authenticateToken, usersController.updatePassword);
usersRouter.post("/", usersController.create);
usersRouter.post("/login", usersController.login);
exports.default = usersRouter;
//# sourceMappingURL=UsersRouter.js.map