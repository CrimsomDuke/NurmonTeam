import { Database } from "../models";
import { UserRegisterDTO, UserPayload, UserLoginDTO, UserUpdateDTO } from "../models/dtos/user.types";
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

    async getAllUsers() {
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
    
        const user = await this.tokenService.verifyToken(token);
        if (!user || isNaN(user.id)) {
            return null;
        }

        const userData = await this.db.User.findByPk(user.id);
        if (!userData) {
            return null;
        }

        // Remove password from user data
        userData.password = '';
        return userData;
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
                email: user.email,
                is_admin : user.is_admin || false
            });
            
            const payload: UserPayload = {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                is_admin: newUser.is_admin
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
                email: existingUser.email,
                is_admin: existingUser.is_admin
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

    async updateUser(userId : number, user : UserUpdateDTO){
        try{
            const existingUser = await this.db.User.findByPk(userId);
            if (!existingUser) {
                throw new Error("User not found");
            }

            if(user.password){
                const newHashedPassword = await bcrypt.hash(user.password, 10);
                existingUser.password = newHashedPassword;
            }

            if (user.is_admin !== undefined && user.is_admin !== null) {
                existingUser.is_admin = user.is_admin;
            }

            await existingUser.save();

            return existingUser;
        }catch(err){
            console.error("Error updating user:", err);
            throw err;
        }
    }

} 

export { UserService };