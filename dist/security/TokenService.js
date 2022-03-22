"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const ResponseData_1 = require("../controller/ResponseData");
class TokenService {
    constructor() {
        this.generateToken = (credentials) => {
            return jsonwebtoken_1.default.sign({ email: credentials.email, username: credentials.name }, process.env.JWT_SECRET, { expiresIn: "3600s" });
        };
        this.authenticateToken = (req, res, next) => {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (token == null) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Acesso não autorizado!"));
            }
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    console.error(err);
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(new ResponseData_1.ResponseData(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Acesso não autorizado!"));
                }
                req["user"] = user;
                next();
            });
        };
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new TokenService();
        }
        return this.instance;
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=TokenService.js.map