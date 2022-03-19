import {NextFunction} from "express";
import {StatusCodes} from "http-status-codes";
import {UsersService} from "./service/Users/UsersService";

const basicAuth = async (req, res, next: NextFunction) => {

    const userService = new UsersService();

    // make authenticate path public
    if (req.path === '/users/login') {
        return next();
    }

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    const response = await userService.authenticate(username, password);
    if (response.statusCode != StatusCodes.OK) {
        return res.status(response.statusCode)
                    .send(response);
    }

    // attach user to request object
    req.user = response.data

    next();
}

export default basicAuth;