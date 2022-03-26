import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";

class BadRequestError extends BaseError {
    constructor(name: string, statusCode: number = StatusCodes.BAD_REQUEST, description: string = "Invalid Request", isOperational: boolean = true) {
        super(name, statusCode, isOperational, description);
    }
}

export default BadRequestError;