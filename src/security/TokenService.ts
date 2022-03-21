import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {ResponseData} from "../controller/ResponseData";

export class TokenService {
    static instance: TokenService;

    static getInstance(): TokenService {
        if (!this.instance) {
            this.instance = new TokenService();
        }
        return this.instance;
    }

    generateToken = (credentials: Credentials) => {
        return jwt.sign( {email: credentials.email, username: credentials.name}, process.env.JWT_SECRET, {expiresIn: "3600s"})
    }

    authenticateToken = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) {
            return res.status(StatusCodes.UNAUTHORIZED).send(new ResponseData(StatusCodes.UNAUTHORIZED, "Acesso não autorizado!"));
        }

        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
            if (err) {
                console.error(err);
                return res.status(StatusCodes.UNAUTHORIZED).send(new ResponseData(StatusCodes.UNAUTHORIZED, "Acesso não autorizado!"));
            }

            req["user"] = user
            next()
        });
    }
}

export interface Credentials {
    email: string;
    name: string;
}