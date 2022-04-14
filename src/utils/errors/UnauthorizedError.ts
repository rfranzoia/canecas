import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";
import logger from "../Logger";

class UnauthorizedError extends BaseError {
    constructor(message: string, error: Error = undefined, statusCode: number = StatusCodes.UNAUTHORIZED, name: string = "Invalid Request") {
        super(message, statusCode, name, error);
        logger.info(`Unauthorized: ${message}`);
    }
}

export default UnauthorizedError;