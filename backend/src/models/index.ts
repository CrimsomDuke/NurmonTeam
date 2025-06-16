import { Sequelize } from 'sequelize-typescript';
import { sequelizeInst } from '../config/db.config';
import { User } from '../models/user';

class Database {
    private sequelize: Sequelize;

    public User = User;

    constructor(sequelize: Sequelize) {
        this.sequelize = sequelize;
        this.sequelize.addModels([User]);
        this.setupRelationships();
    }

    private setupRelationships() {
        // Define relationships here if any
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
