import {Router} from "express";
import {tokenService} from "../security/TokenService";
import {UsersController} from "../controller/users/UsersController";

const usersController = new UsersController();
const usersRouter = Router();

usersRouter.get("/", tokenService.authenticateToken, usersController.list);
usersRouter.get("/count", tokenService.authenticateToken, usersController.count);
usersRouter.get("/role/:role", tokenService.authenticateToken, usersController.listByRole);
usersRouter.get("/:id", tokenService.authenticateToken, usersController.get);
usersRouter.get("/email/:email", tokenService.authenticateToken, usersController.getByEmail);

usersRouter.delete("/:id", tokenService.authenticateToken, usersController.delete);
usersRouter.put("/:id", tokenService.authenticateToken, usersController.update);

usersRouter.post("/password", tokenService.authenticateToken, usersController.updatePassword);

usersRouter.post("/", usersController.create);
usersRouter.post("/login", usersController.login);

export default usersRouter;