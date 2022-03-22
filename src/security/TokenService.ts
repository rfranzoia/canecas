import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {ResponseData} from "../controller/ResponseData";
import {UserRepository} from "../domain/Users/UserRepository";
import {UserDTO} from "../controller/Users/UserDTO";

export class TokenService {
    static instance: TokenService;

    static getInstance(): TokenService {
        if (!this.instance) {
            this.instance = new TokenService();
        }
        return this.instance;
    }

    generateToken = (credentials: Credentials) => {
        return jwt.sign( {id: credentials.id, email: credentials.email, username: credentials.name}, process.env.JWT_SECRET, {expiresIn: "36000s"})
    }

    authenticateToken = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) {
            return res.status(StatusCodes.UNAUTHORIZED).send(new ResponseData(StatusCodes.UNAUTHORIZED, "Acesso não autorizado!"));
        }

        jwt.verify(token, process.env.JWT_SECRET as string, async (err: any, user: any) => {
            if (err) {
                console.error(err);
                return res.status(StatusCodes.UNAUTHORIZED).send(new ResponseData(StatusCodes.UNAUTHORIZED, "Acesso não autorizado!", err));
            }

            // add user to the request in case it's needed forward ahead
            req["user"] = UserDTO.mapToDTO(await UserRepository.getInstance().findById(user.id));
            next()
        });
    }
}

export interface Credentials {
    id: number;
    email: string;
    name: string;
}