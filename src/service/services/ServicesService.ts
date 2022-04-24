import nodemailer from "nodemailer";
import {StatusCodes} from "http-status-codes";
import {responseMessage} from "../../controller/ResponseData";
import BadRequestError from "../../utils/errors/BadRequestError";
import logger from "../../utils/Logger";
import {EmailService} from "../../domain/services/Service";
import fs from "fs";
import {imagesPath} from "../../../CanecasServiceServer";
import path from "path";

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

    async uploadFile(origin: string, name: string, data) {
        let matches = data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/), response = { type: null, data: null};

        if (matches.length !== 3) {
            return new BadRequestError("The data provided is not in valid Base64 format");
        }

        response.data = new Buffer(matches[2], 'base64');

        try {
            fs.writeFileSync(path.join(imagesPath, origin, "/", name), response.data, 'utf8');
            return responseMessage(`${name} was uploaded successfully`, StatusCodes.OK);
        } catch (error) {
            logger.error("Upload Error", error);
            return new BadRequestError(error);
        }
    }

}

export const servicesService = new ServicesService();