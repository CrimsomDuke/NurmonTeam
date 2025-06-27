import { Database } from "../models";
import { Op } from "sequelize";


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

    async getAbilitiesByNurmonId(nurmonId: number) {
        try {
            const nurmon = await this.db.Nurmon.findByPk(nurmonId)

            if (!nurmon) {
                return [];
            }

            const abilitiesIds: number[] = []
            if (nurmon.first_ability_id) {
                abilitiesIds.push(nurmon.first_ability_id);
            }
            if (nurmon.second_ability_id) {
                abilitiesIds.push(nurmon.second_ability_id);
            }
            if (nurmon.third_ability_id) {
                abilitiesIds.push(nurmon.third_ability_id);
            }

            const abilities = await this.db.Ability.findAll({
                where: {
                    id: {
                        [Op.in]: abilitiesIds
                    }
                }
            });

            return abilities;
        } catch (err) {
            console.error("Error fetching abilities by Nurmon ID:", err);
            throw err;
        }
    }

}

export default AbilityService;