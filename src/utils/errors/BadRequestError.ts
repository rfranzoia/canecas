import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";
import logger from "../Logger";

class BadRequestError extends BaseError {
    constructor(message: string, error: Error = undefined, statusCode: number = StatusCodes.BAD_REQUEST, name: string = "Invalid Request") {
        super(message, statusCode, name, error);
        logger.error(`BadRequest: ${message}`);
    }
}

export default BadRequestError;