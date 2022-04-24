import {StatusCodes} from "http-status-codes";
import {servicesService} from "../../service/services/ServicesService";
import {evaluateResult} from "../ControllerHelper";
import {EmailService} from "../../domain/services/Service";

export class ServicesController {

    async sendEmail(req, res) {
        const {destination, subject, message} = req.body;
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

