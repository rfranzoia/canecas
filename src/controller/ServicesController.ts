import { StatusCodes } from "http-status-codes";
import { EmailService } from "../domain/Service";
import { servicesService } from "../service/ServicesService";
import { evaluateResult } from "./ControllerHelper";

export class ServicesController {

    async sendEmail(req, res) {
        const { destination, subject, message } = req.body;
        const email: EmailService = {
            destination: destination,
            subject: subject,
            message: message
        }
        const result = await servicesService.sendEmail(email);
        return evaluateResult(result, res, StatusCodes.OK, () => result);
    }

    async uploadFile(req, res) {
        const { origin, name, data } = req.body;
        const result = await servicesService.uploadFile(origin, name, data);
        return evaluateResult(result, res, StatusCodes.OK, () => result);
    }

}

