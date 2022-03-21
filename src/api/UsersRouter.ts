import {UsersController} from "../controller/Users/UsersController";
import {Router} from "express";
import basicAuth from "../security/basicAuth";
import {TokenService} from "../security/TokenService";

const usersController = new UsersController();
const usersRouter = Router();

usersRouter.get("/", TokenService.getInstance().authenticateToken, usersController.list);
usersRouter.get("/count", TokenService.getInstance().authenticateToken, usersController.count);
usersRouter.get("/role/:role", TokenService.getInstance().authenticateToken, usersController.listByUserRole);
usersRouter.get("/:id", TokenService.getInstance().authenticateToken, usersController.get);
usersRouter.get("/email/:email", TokenService.getInstance().authenticateToken, usersController.getByEmail);

usersRouter.delete("/:id", TokenService.getInstance().authenticateToken, usersController.delete);
usersRouter.put("/:id", TokenService.getInstance().authenticateToken, usersController.update);

usersRouter.post("/password", TokenService.getInstance().authenticateToken, usersController.updatePassword);

usersRouter.post("/", usersController.create);
usersRouter.post("/login", usersController.login);

export default usersRouter;