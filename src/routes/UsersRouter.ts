import {UsersController} from "../controller/UsersController";
import {Router} from "express";
import basicAuth from "../basicAuth";

const usersController = new UsersController();
const usersRouter = Router();

usersRouter.get("/", basicAuth, usersController.list);
usersRouter.get("/count", basicAuth, usersController.count);
usersRouter.get("/role/:role", basicAuth, usersController.listByUserRole);
usersRouter.get("/:id", basicAuth, usersController.get);
usersRouter.get("/email/:email", basicAuth, usersController.getByEmail);

usersRouter.delete("/:id", basicAuth, usersController.delete);
usersRouter.put("/:id", basicAuth, usersController.update);

usersRouter.post("/", usersController.create);
usersRouter.post("/password", usersController.updatePassword);
usersRouter.post("/login", usersController.login);

export default usersRouter;