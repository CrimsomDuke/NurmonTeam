
import { UserService } from "../services/user.service";
import { Database } from "../models";
import { TokenService } from "../services/token.service";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import { NurmonService } from "../services/nurmon.service";
import { MovementController } from "../controllers/movement.controller";
import { MovementService } from "../services/movement.service";

class Container {

    private static instance: Container;

    //services
    public readonly UserService : UserService;
    public readonly TokenService : TokenService;
    public readonly MiddlewareProvider : MiddlewareProvider;
    public readonly NurmonService : NurmonService;
    public readonly MovementService : MovementService;

    private constructor(dbContext : Database) {
        console.log("Container initialized");

        this.TokenService = new TokenService();
        this.UserService = new UserService(dbContext, this.TokenService);
        this.MiddlewareProvider = new MiddlewareProvider(this.UserService, this.TokenService);
        this.NurmonService = new NurmonService(dbContext);
        this.MovementService = new MovementService(dbContext);
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