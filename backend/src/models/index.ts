import { Sequelize } from 'sequelize-typescript';
import { sequelizeInst } from '../config/db.config';
import { User } from '../models/user';
import { Team } from '../models/team';
import { Item } from './item';
import { Nature } from './nature';
import { Type } from '../models/type';
import { Movement } from '../models/movement';
import { Ability } from './ability';
import { Nurmon } from './nurmon';
import { NurmonMovement } from '../models/nurmon_movement';
import { MemberNurmonMovement } from './member_nurmon_movement';
import { TeamMember } from './team_member';

class Database {
    private sequelize: Sequelize;

    public User = User;
    public Team = Team;
    public Item = Item;
    public Nature = Nature;
    public Type = Type;
    public Movement = Movement
    public Ability = Ability
    public Nurmon = Nurmon
    public TeamMember = TeamMember;
    public NurmonMovement = NurmonMovement;
    public MemberNurmonMovement = MemberNurmonMovement; 

    constructor(sequelize: Sequelize) {
        this.sequelize = sequelize;
        this.sequelize.addModels([User, Team, Item, Nature, Type, 
            Movement, Ability, Nurmon, TeamMember, NurmonMovement, MemberNurmonMovement]);
    }

    public async connect() {
        try {
            await this.sequelize.authenticate();
            await this.sequelize.sync({
                alter: true
            });
            console.log('Database connected and models synced.');
        } catch (err) {
            console.error('Database connection failed:', err);
            throw err;
        }
    }
}

export const db = new Database(sequelizeInst);
export { Database }
