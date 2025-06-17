import { Database } from "../models";
import { UserRegisterDTO, UserPayload, UserLoginDTO } from "../models/dtos/user.types";
import bcrypt from 'bcrypt';
import { TokenService } from "./token.service";
import { Op } from "sequelize";

class UserService {

    private db : Database;
    private tokenService : TokenService; 

    constructor(dbInst : Database, tokenService : TokenService){
        this.db = dbInst;
        this.tokenService = tokenService;
    }

    async getUsers() {
        const users = await this.db.User.findAll();
        users.forEach((user) => {
            // Remove password from user data
            user.password = '';
        })

        return users;
    }

    async getUserById(id : number){
        const user = await this.db.User.findByPk(id);
        if (!user) {
            return null;
        }
        // Remove password from user data
        user.password = '';
        return user;
    }

    async getUserByToken(token : string){
        try {
            const payload = await this.tokenService.verifyToken(token);
            if (!payload) {
                return null;
            }
            const user = await this.getUserById(payload.id);
            return user;
        } catch (err) {
            console.error("Error verifying token:", err);
            throw err;
        }
    }

    async getUserByRegisterDto(data : UserRegisterDTO){
        console.log(data);
        const user = await this.db.User.findOne({
            where: {
                [Op.or]: [
                    { username: data.username },
                    { email: data.email }
                ]
            }
        });
        if (!user) {
            return null;
        }

        // Remove password from user data
        user.password = '';

        return user;
    }

    async registerUser(user : UserRegisterDTO){
        try{
            const hashedPassword = await bcrypt.hash(user.password, 10);

            const newUser = await this.db.User.create({
                username: user.username,
                password: hashedPassword,
                email: user.email
            });
            
            const payload: UserPayload = {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }

            const token = await this.tokenService.generateToken(payload)
            if(!token){
                throw new Error("Token generation failed");
            }

            return { token : token}
        }catch(err) {
            console.error("Error registering user:", err);
            throw err;
        }
    }

    async loginUser(user : UserLoginDTO){
        try{
            const existingUser = await this.db.User.findOne({
                where: {
                    username: user.username
                }
            });

            if (!existingUser) {
                throw new Error("User not found");
            }

            const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
            if (!isPasswordValid) {
                throw new Error("Invalid password");
            }

            const payload: UserPayload = {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email
            }

            const token = await this.tokenService.generateToken(payload);
            if (!token) {
                throw new Error("Token generation failed");
            }

            return { token: token };
        }catch(err){
            console.error("Error logging in user:", err);
            throw err;
        }
    }

} 

export { UserService };