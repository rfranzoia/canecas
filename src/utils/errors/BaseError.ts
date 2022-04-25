class BaseError extends Error {
    statusCode: number;
    description: string;
    error: Error;

    constructor(message: string, statusCode: number, name: string, error: Error) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype)

        Error.captureStackTrace(this)

        this.name = name;
        this.statusCode = statusCode;
        this.description = message;
        this.error = error;

    }
}

export default BaseError;