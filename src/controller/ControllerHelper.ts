import {StatusCodes} from "http-status-codes";
import NotFoundError from "../utils/errors/NotFoundError";
import InternalServerErrorError from "../utils/errors/InternalServerErrorError";
import BadRequestError from "../utils/errors/BadRequestError";

export const evaluateResult = async (result, res, status, data) => {
    if (result instanceof NotFoundError) {
        return res.status(StatusCodes.NOT_FOUND).send(result as NotFoundError);

    } else if (result instanceof InternalServerErrorError) {
        const error = result as InternalServerErrorError;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);

    } else if (result instanceof BadRequestError) {
        const error = result as BadRequestError;
        return res.status(StatusCodes.BAD_REQUEST).send(error);
    }
    return res.status(status).send(data);
}
