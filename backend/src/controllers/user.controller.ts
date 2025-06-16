import { UserService } from "../services/user.service";

class UserController{

    private userService: UserService;

    constructor(userService: UserService) {
        console.log("UserController initialized", userService);
        this.userService = userService;
    }

    getUsers() {
        return [this.userService.getUsers()];
    }
}

export { UserController };