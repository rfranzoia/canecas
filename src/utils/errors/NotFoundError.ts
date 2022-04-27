import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";
import logger from "../Logger";

class NotFoundError extends BaseError {
    constructor(message: string, error: Error = undefined, statusCode: number = StatusCodes.NOT_FOUND, name: string = "Not found") {
        super(message, statusCode, name, error);
        logger.error(`NotFound: ${message}`);
    }
}

export default NotFoundError;