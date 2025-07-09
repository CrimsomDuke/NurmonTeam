import { Database } from "../models";
import { Op } from "sequelize";
import { AbilityCreateDTO } from "../models/dtos/ability.types";


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

    async getAbilitiesBySearch(searchTerm: string) {
        try {
            const abilities = await this.db.Ability.findAll({
                where: {
                    name: {
                        [Op.like]: `%${searchTerm}%`
                    }
                }
            });
            return abilities;
        } catch (err) {
            console.error("Error searching abilities:", err);
            throw err;
        }
    }

    async createAbility(abilityData : AbilityCreateDTO){
        try{
            const existingAbility = await this.db.Ability.findOne({
                where: {
                    name: abilityData.name
                }
            });

            if (existingAbility) {
                throw new Error("Ability with this name already exists");
            }

            const newAbility = await this.db.Ability.create(abilityData);
            return newAbility;
        }catch(err){
            console.error("Error creating ability:", err);
            throw err;
        }
    }

    async updateAbility(id: number, abilityData: AbilityCreateDTO) {
        try {
            const ability = await this.db.Ability.findByPk(id);
            if (!ability) {
                throw new Error("Ability not found");
            }
            ability.name = abilityData.name || ability.name;
            ability.description = abilityData.description || ability.description;

            await ability.save();

            return ability;
        } catch (err) {
            console.error("Error updating ability:", err);
            throw err;
        }
    }

    async deleteAbility(id: number) {
        try {
            const ability = await this.db.Ability.findByPk(id);
            if (!ability) {
                throw new Error("Ability not found");
            }

            await ability.destroy();
        } catch (err) {
            console.error("Error deleting ability:", err);
            throw err;
        }
    }

}

export default AbilityService;