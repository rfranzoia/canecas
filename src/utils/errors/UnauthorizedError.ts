import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";
import logger from "../Logger";

class UnauthorizedError extends BaseError {
    constructor(name: string, error: Error = undefined, statusCode: number = StatusCodes.BAD_REQUEST, description: string = "Invalid Request") {
        super(name, statusCode, description, error);
        logger.info(`Unauthorized: ${name}`);
    }
}

export default UnauthorizedError;