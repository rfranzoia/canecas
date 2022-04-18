import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";
import logger from "../Logger";

class DatabaseError extends BaseError {
    constructor(message: string, error: Error = undefined, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR, name: string = "Invalid Request") {
        super(message, statusCode, name, error);
        logger.info(`Database: ${message}`);
    }
}

export default DatabaseError;