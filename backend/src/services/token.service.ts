
import jwt from 'jsonwebtoken';
import global_vars from '../config/global.config';
import { UserPayload } from '../models/dtos/user.types';

class TokenService{

    public constructor(){
        console.log("TokenService initialized");
    }

    public generateToken(payload : UserPayload) : string{
        return jwt.sign(payload, global_vars.JWT_SECRET);
    }

    public verifyToken(token: string): any {
        try {
            return jwt.verify(token, global_vars.JWT_SECRET);
        } catch (error) {
            console.error("Token verification failed:", error);
            return null;
        }
    }

}

export { TokenService };