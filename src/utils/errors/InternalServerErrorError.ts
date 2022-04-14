import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";

class InternalServerErrorError extends BaseError {
    constructor(message: string, error: Error = undefined, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR, name: string = "Internal Server Error") {
        super(message, statusCode, name, error);
    }
}

export default InternalServerErrorError;