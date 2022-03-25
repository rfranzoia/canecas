import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";

class InternalServerError extends BaseError {
    constructor(name: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR, description: string = "Internal Server Error", isOperational: boolean = true) {
        super(name, statusCode, isOperational, description);
    }
}

export default InternalServerError;