import { Router } from "express";
import { ServicesController } from "../controller/services/ServicesController";

const servicesController = new ServicesController();
const servicesRouter = Router();

servicesRouter.post("/email/send", servicesController.sendEmail);
servicesRouter.post("/file/upload", servicesController.uploadFile);

export default servicesRouter;
