
import jwt from 'jsonwebtoken';
import global_vars from '../config/global.config';

class TokenService{

    public constructor(){
        console.log("TokenService initialized");
    }

    public generateToken(payload : object) : string{
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