import { NextFunction, Request, RequestHandler, Response } from "express";
import { TokenService } from "../services/token.service";
import { UserService } from "../services/user.service";
import { UserPayload } from "../models/dtos/user.types";


export class MiddlewareProvider {

    public userService;
    public tokenService;

    constructor(userService: UserService, tokenService: TokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }

    public authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

        console.log("Auth middleware called");

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: "Token required" });
            return;
        }

        try {

            console.log("Verifying token:", token);

            const user = await this.tokenService.verifyToken(token);
            console.log("User from token:", user);
            if (!user || isNaN(user.id)) {
                res.status(401).json({ error: "Invalid token" });
                return;
            }

            next();
        } catch (err) {
            console.error("Error verifying token:", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    }

    public isAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: "Token Required" });
            return;
        }

        try {
            const user : UserPayload = await this.tokenService.verifyToken(token);
            if (!user || user.is_admin === false) {
                res.status(403).json({ error: "Forbidden: Admin access required" });
                return;
            }

            next();
        } catch (err) {
            console.error("Error verifying token:", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    }
}