import { Request, RequestHandler, Response } from "express";
import { UserDTO, UserRegisterDTO, UserUpdateDTO } from "../models/dtos/user.types";
import { UserService } from "../services/user.service";

class UserController{

    private userService: UserService;

    constructor(userService: UserService) {
        console.log("UserController initialized", userService);
        this.userService = userService;
    }

    registerUser : RequestHandler = async (req: Request, res : Response) => {
        try {
            const userData = req.body;

            if (!userData.username || !userData.password || !userData.email) {
                res.status(400).json({ error: "Username, password, and email are required" });
                return;
            }

            console.log("Registering user with data:", userData);
            const existingUser = await this.userService.getUserByRegisterDto(userData);
            if(existingUser){
                res.status(400).json({ error: "Username or email already exists" });
                console.log("lLega aca");
                return;
            }

            const token = await this.userService.registerUser(userData);
            res.status(201).json(token);
        } catch (err) {
            console.error("Error registering user:", err);
            res.status(500).json({ error: "Error registering user", data : (err as Error).message });
            return;
        }
    }

    loginUser : RequestHandler = async (req : Request, res : Response) => {
        try {
            const user = req.body;

            if (!user.username || !user.password) {
                res.status(400).json({ error: "Username and password are required" });
                return;
            }

            const token = await this.userService.loginUser(user);
            res.status(200).json(token);
        } catch (err) {
            console.error("Error logging in user:", err);
            res.status(500).json({ error: "Internal server error", data : (err as Error).message });
        }
    }

    getAllUsers = async (req : Request, res : Response) => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (err) {
            console.error("Error fetching users:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    getUserById = async (req : Request, res : Response) => {
        try {
            const userId = parseInt(req.params.id);
            const user = await this.userService.getUserById(userId);
            if(!user){
                res.status(404).json({ error: "User not found" });
                return;
            }

            user.password = ''; // Remove password from response
            res.status(200).json(user);
        } catch (err) {
            console.error("Error fetching user by ID:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    }


    getMe = async (req : Request, res : Response) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: "Token required" });
            return;
        }

        try {
            const user  = await this.userService.getUserByToken(token);
            if (!user) {
                res.status(401).json({ error: "Invalid token" });
                return;
            }

            user.password = ''; // Remove password from response
            res.status(200).json(user);
        } catch (err) {
            console.error("Error fetching user by token:", err);
            res.status(500).json({ error: "Internal server error", data : (err as Error).message });
        }
    }

    updateUser = async (req : Request, res : Response) => {
        const userId = parseInt(req.params.id);
        if(!userId) {
            res.status(400).json({ error: "User ID is required" });
            return;
        }

        const userData = req.body as UserUpdateDTO;
        if(!userData || !userData.password && !userData.is_admin){
            res.status(400).json({ error: "Invalid user data" });
            return;
        }

        try{
            const updatedUser = await this.userService.updateUser(userId, userData);
            if(!updatedUser){
                res.status(404).json({ error: "User not found" });
                return;
            }

            updatedUser.password = ''; // Remove password from response
            res.status(200).json(updatedUser);
            return;
        }catch(err){
            console.error("Error updating user:", err);
            res.status(500).json({ error: "Error updating the user", data : (err as Error).message });
            return;
        }
    }

}

export { UserController };