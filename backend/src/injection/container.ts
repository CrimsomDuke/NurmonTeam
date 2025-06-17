
import { UserService } from "../services/user.service";
import { Database } from "../models";
import { TokenService } from "../services/token.service";

class Container {

    private static instance: Container;

    //services
    public readonly UserService : UserService;
    public readonly TokenService : TokenService;

    private constructor(dbContext : Database) {
        console.log("Container initialized");

        this.TokenService = new TokenService();
        this.UserService = new UserService(dbContext, this.TokenService);
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