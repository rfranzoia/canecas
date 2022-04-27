import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";
import logger from "../Logger";

class InternalServerErrorError extends BaseError {
    constructor(message: string, error: Error = undefined, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR, name: string = "Internal Server Error") {
        super(message, statusCode, name, error);
        logger.error(`InternalServerError: ${message}`);
    }
}

export default InternalServerErrorError;