import { NextFunction, Request, RequestHandler, Response } from "express";
import { TokenService } from "../services/token.service";
import { UserService } from "../services/user.service";


export class MiddlewareProvider {

    public userService;
    public tokenService;

    constructor(userService: UserService, tokenService: TokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }

    public authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: "Token required" });
            return;
        }

        try {
            const user = await this.tokenService.verifyToken(token);
            if (!user) {
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
            const user = await this.tokenService.verifyToken(token);
            if (!user || user.isAdmin === false) {
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