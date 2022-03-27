import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";

class InternalServerErrorError extends BaseError {
    constructor(name: string, error: Error = undefined, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR, description: string = "Internal Server Error") {
        super(name, statusCode, description, error);
    }
}

export default InternalServerErrorError;