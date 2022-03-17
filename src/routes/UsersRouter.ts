import {UsersController} from "../controller/UsersController";
import {Router} from "express";

const usersController = new UsersController();
const usersRouter = Router();

usersRouter.get("/", usersController.list);
usersRouter.get("/count", usersController.count);
usersRouter.get("/role/:role", usersController.listByUserRole);
usersRouter.get("/:id", usersController.get);
usersRouter.get("/email/:email", usersController.getByEmail);

usersRouter.delete("/:id", usersController.delete);
usersRouter.put("/:id", usersController.update);

usersRouter.post("/", usersController.create);
usersRouter.post("/password", usersController.updatePassword);
usersRouter.post("/login", usersController.login);

export default usersRouter;