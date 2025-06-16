
import { UserService } from "../services/user.service";
import { Database } from "../models";

class Container {

    private static instance: Container;

    //services
    public readonly UserService : UserService;

    private constructor(dbContext : Database) {
        console.log("Container initialized");

        this.UserService = new UserService(dbContext);
    }
    
    public static getInstance(dbContext : Database): Container {
        if (!Container.instance) {
            Container.instance = new Container(dbContext);
        }
        return Container.instance;
    }
}

export { Container };
export default Container;