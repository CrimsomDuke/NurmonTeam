import { Database } from "../models";


class TypeService {

    private readonly db : Database;

    constructor(dbInst : Database) {
        this.db = dbInst;
    }

    async getAllTypes(){
        try {
            const types = await this.db.Type.findAll();
            return types;
        } catch (err) {
            console.error("Error fetching all types:", err);
            throw err;
        }
    }

    async getTypeById(id: number) {
        try {
            const type = await this.db.Type.findByPk(id);
            if (!type) {
                return null;
            }
            return type;
        } catch (err) {
            console.error("Error fetching type by ID:", err);
            throw err;
        }
    }

}

export default TypeService;