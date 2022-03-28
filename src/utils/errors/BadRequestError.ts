import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";
import logger from "../Logger";

class BadRequestError extends BaseError {
    constructor(name: string, error: Error = undefined, statusCode: number = StatusCodes.BAD_REQUEST, description: string = "Invalid Request") {
        super(name, statusCode, description, error);
        logger.info(`BadRequest: ${name}`);
    }
}

export default BadRequestError;