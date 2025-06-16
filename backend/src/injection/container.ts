
import { UserService } from "../services/user.service";

class Container {

    private static instance: Container;

    //services
    public readonly UserService : UserService;

    private constructor() {
        console.log("Container initialized");

        this.UserService = new UserService(null);
    }
    
    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }
}

export const container = Container.getInstance();