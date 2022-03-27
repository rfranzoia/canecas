import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";

class NotFoundError extends BaseError {
    constructor(name: string, error: Error = undefined, statusCode: number = StatusCodes.NOT_FOUND, description: string = "Not found") {
        super(name, statusCode, description, error);
    }
}

export default NotFoundError;