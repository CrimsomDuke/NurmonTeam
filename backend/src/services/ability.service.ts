import { Database } from "../models";


class AbilityService {

    private readonly db: Database;

    constructor(dbInst : Database){
        this.db = dbInst;
    }

    async getAllAbilities() {
        try {
            const abilities = await this.db.Ability.findAll();
            return abilities;
        } catch (err) {
            console.error("Error fetching all abilities:", err);
            throw err;
        }
    }

    async getAbilityById(id: number) {
        try {
            const ability = await this.db.Ability.findByPk(id);
            if (!ability) {
                return null;
            }
            return ability;
        } catch (err) {
            console.error("Error fetching ability by ID:", err);
            throw err;
        }
    }

}

export default AbilityService;