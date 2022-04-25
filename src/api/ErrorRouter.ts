import {Router} from "express";
import {StatusCodes} from "http-status-codes";
import BadRequestError from "../utils/errors/BadRequestError";
import NotFoundError from "../utils/errors/NotFoundError";
import UnauthorizedError from "../utils/errors/UnauthorizedError";
import InternalServerErrorError from "../utils/errors/InternalServerErrorError";
import DatabaseError from "../utils/errors/DatabaseError";
import {responseMessage} from "../controller/DefaultResponseMessage";

const errorRouter = Router();

errorRouter.get("/badRequest", (req, res) => {
    return res.status(StatusCodes.BAD_REQUEST).send(new BadRequestError("Sample BadRequest"));
});

errorRouter.get("/notFound", (req, res) => {
    return res.status(StatusCodes.NOT_FOUND).send(new NotFoundError("Sample NotFound"));
});

errorRouter.get("/unauthorized", (req, res) => {
    return res.status(StatusCodes.UNAUTHORIZED).send(new UnauthorizedError("Sample Unauthorized"));
});

errorRouter.get("/internalServerError", (req, res) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new InternalServerErrorError("Sample InternalServerError"));
});

errorRouter.get("/databaseError", (req, res) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(new DatabaseError("Sample DatabaseError"));
});

errorRouter.get("/noError", (req, res) => {
    return res.status(StatusCodes.OK).send(responseMessage("No error message", StatusCodes.OK, { id: 0, data: "data string"}));
});

export default errorRouter;