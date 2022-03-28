import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";
import logger from "../Logger";

class NotFoundError extends BaseError {
    constructor(name: string, error: Error = undefined, statusCode: number = StatusCodes.NOT_FOUND, description: string = "Not found") {
        super(name, statusCode, description, error);
        logger.info(`NotFound: ${name}`);
    }
}

export default NotFoundError;