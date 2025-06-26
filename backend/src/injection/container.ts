
import { UserService } from "../services/user.service";
import { Database } from "../models";
import { TokenService } from "../services/token.service";
import { MiddlewareProvider } from "../middlewares/middleware.provider";
import { NurmonService } from "../services/nurmon.service";
import { MovementController } from "../controllers/movement.controller";
import { MovementService } from "../services/movement.service";
import ItemService from "../services/item.service";
import NurmonMovementController from "../controllers/nurmon_movement.controller";
import { Nurmon } from "../models/nurmon";
import NurmonMovementService from "../services/nurmon_movement.service";
import TeamService from "../services/team.service";
import TypeService from "../services/type.service";
import AbilityService from "../services/ability.service";
import NatureService from "../services/nature.service";
import TeamMemberService from "../services/team_member.service";
import MemberNurmonMovementService from "../services/member_nurmon_movement.service";

class Container {

    private static instance: Container;

    //services
    public readonly UserService : UserService;
    public readonly TokenService : TokenService;
    public readonly MiddlewareProvider : MiddlewareProvider;
    public readonly NurmonService : NurmonService;
    public readonly MovementService : MovementService;
    public readonly ItemService : ItemService;
    public readonly NurmonMovementService : NurmonMovementService
    public readonly TeamService : TeamService;
    public readonly TypeService : TypeService;
    public readonly AbilityService : AbilityService
    public readonly NatureService : NatureService;
    public readonly TeamMemberService : TeamMemberService;
    public readonly MemberNurmonMovementService : MemberNurmonMovementService;

    private constructor(dbContext : Database) {
        console.log("Container initialized");

        this.TokenService = new TokenService();
        this.UserService = new UserService(dbContext, this.TokenService);
        this.MiddlewareProvider = new MiddlewareProvider(this.UserService, this.TokenService);
        this.NurmonService = new NurmonService(dbContext);
        this.MovementService = new MovementService(dbContext);
        this.ItemService = new ItemService(dbContext);
        this.NurmonMovementService = new NurmonMovementService(dbContext);
        this.TeamService = new TeamService(dbContext);
        this.TypeService = new TypeService(dbContext);
        this.AbilityService = new AbilityService(dbContext);
        this.NatureService = new NatureService(dbContext);
        this.TeamMemberService = new TeamMemberService(dbContext);
        this.MemberNurmonMovementService = new MemberNurmonMovementService(dbContext);

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