import BaseError from "./BaseError";
import {StatusCodes} from "http-status-codes";

class UnauthorizedError extends BaseError {
    constructor(name: string, error: Error = undefined, statusCode: number = StatusCodes.BAD_REQUEST, description: string = "Invalid Request") {
        super(name, statusCode, description, error);
    }
}

export default UnauthorizedError;