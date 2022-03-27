class BaseError extends Error {
    statusCode: number;
    error: Error;

    constructor(name: string, statusCode: number, description: string, error: Error) {
        super(description)

        Object.setPrototypeOf(this, new.target.prototype)

        this.name = name;
        this.statusCode = statusCode;
        this.error = error;

        Error.captureStackTrace(this)
    }
}

export default BaseError;