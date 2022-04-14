class ResponseData {
    statusCode: number;
    message: string;
    data: any;

    constructor(message: string, statusCode?: number, data?: any) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

}

export const responseMessage = (message: string, statusCode?: number, data?: any) => {
    return new ResponseData(message, statusCode, data);
}