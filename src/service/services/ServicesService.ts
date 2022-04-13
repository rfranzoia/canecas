import nodemailer from "nodemailer";
import {StatusCodes} from "http-status-codes";
import {responseMessage} from "../../controller/ResponseData";
import BadRequestError from "../../utils/errors/BadRequestError";
import logger from "../../utils/Logger";
import {EmailService} from "../../domain/services/Service";

const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || "";

class ServicesService {

    async sendEmail(email: EmailService) {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "rfranzoia@gmail.com",
                pass: GMAIL_APP_PASSWORD
            }
        });

        const mailOptions = {
            from: "rfranzoia@gmail.com",
            to: email.destination.toString(),
            subject: email.subject,
            html: email.message
        };

        try {
            const result = await transporter.sendMail(mailOptions);
            return responseMessage("Email sent successfully", StatusCodes.OK, result.response);
        } catch (error) {
            logger.error("Error sending email", error);
            return new BadRequestError("Error while sendint the email", error);
        }
    }

    async uploadFile() {

    }
}


export const servicesService = new ServicesService();