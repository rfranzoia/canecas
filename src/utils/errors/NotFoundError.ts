import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";

class NotFoundError extends BaseError {
    constructor(name: string, statusCode: number = StatusCodes.NOT_FOUND, description: string = "Not found", isOperational: boolean = true) {
        super(name, statusCode, isOperational, description);
    }
}

export default NotFoundError;