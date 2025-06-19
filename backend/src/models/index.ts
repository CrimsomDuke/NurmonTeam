import { Sequelize } from 'sequelize-typescript';
import { sequelizeInst } from '../config/db.config';
import { User } from '../models/user';
import { Team } from '../models/team';
import { Item } from './item';
import { Nature } from './nature';

class Database {
    private sequelize: Sequelize;

    public User = User;
    public Team = Team;
    public Item = Item;
    public Nature = Nature;

    constructor(sequelize: Sequelize) {
        this.sequelize = sequelize;
        this.sequelize.addModels([User, Team, Item, Nature]);
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
