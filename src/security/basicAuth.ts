import { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "../service/users/UsersService";
import UnauthorizedError from "../utils/errors/UnauthorizedError";

const basicAuth = async (req, res, next: NextFunction) => {

    // make authenticate path public
    if (req.path === '/users/login') {
        return next();
    }

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    const response = await userService.authenticate(username, password);
    if (response instanceof UnauthorizedError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not authorized' });
    }

    // attach user to request object
    req.user = response;

    next();
}

export default basicAuth;