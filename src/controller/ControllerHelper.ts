import { StatusCodes } from "http-status-codes";
import BadRequestError from "../utils/errors/BadRequestError";
import InternalServerErrorError from "../utils/errors/InternalServerErrorError";
import NotFoundError from "../utils/errors/NotFoundError";
import UnauthorizedError from "../utils/errors/UnauthorizedError";
import { responseMessage } from "./DefaultResponseMessage";

export const evaluateResult = async (result, res, status, callback) => {
    if (result instanceof NotFoundError) {
        return res.status(StatusCodes.NOT_FOUND).send(result as NotFoundError);

    } else if (result instanceof InternalServerErrorError) {
        const error = result as InternalServerErrorError;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);

    } else if (result instanceof BadRequestError) {
        const error = result as BadRequestError;
        return res.status(StatusCodes.BAD_REQUEST).send(error);

    } else if (result instanceof UnauthorizedError) {
        const error = result as UnauthorizedError;
        return res.status(StatusCodes.UNAUTHORIZED).send(error);
    }

    const data = await callback();
    return res.status(status).send(responseMessage("", status, data));
}
