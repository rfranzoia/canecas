import { StatusCodes } from "http-status-codes";

class DefaultResponseMessage {
    statusCode: number;
    message: string;
    data: any;

    constructor(message: string, statusCode?: number, data?: any) {
        this.statusCode = statusCode ? statusCode : StatusCodes.BAD_REQUEST;
        this.message = message;
        this.data = data;
    }

}

export const responseMessage = (message: string, statusCode?: number, data?: any) => {
    return new DefaultResponseMessage(message, statusCode, data);
}