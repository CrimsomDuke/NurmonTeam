import { Database } from "../models"
import { NurmonCreateDTO, NurmonUpdateDTO } from "../models/dtos/nurmon.types";
import { Op } from "sequelize";

class NurmonService {
    private db : Database;

    constructor(dbInst : Database){
        this.db = dbInst;
    }

    async getAllNurmons() {
        const nurmons = await this.db.Nurmon.findAll({
            include : [
                {
                    model: this.db.Type,
                    as: 'type'
                },
            ]
        });
        return nurmons;
    }

    async getNurmonById(id: number) {
        const nurmon = await this.db.Nurmon.findByPk(id, {
            include: [
                {
                    model: this.db.Type,
                    as: 'type',
                },
                {
                    model : this.db.Ability,
                    as : 'first_ability'
                },
                {
                    model : this.db.Ability,
                    as : 'second_ability',
                },
                {
                    model : this.db.Ability,
                    as : 'third_ability',
                    
                }
            ]
        });

        if (!nurmon) {
            return null;
        }

        // hay que hacer esta maniobrita para evitar que las putas abilities
        // no se repitan al ser 1 id y 2,3 null

        const plain = nurmon.get({ plain: true });
        console.log(plain);

        if(!plain.first_ability_id){
            plain.first_ability = null;
        }

        if(!plain.second_ability_id){
            plain.second_ability = null;
        }

        if(!plain.third_ability_id){
            plain.third_ability = null;
        }

        return plain;
    }

    async getNurmonByName(name: string) {
        try {
            const nurmon = await this.db.Nurmon.findOne({
                where: { 
                    name
                 },
                include: [
                    {
                        model: this.db.Type,
                        as: 'type'
                    }
                ]
            });
            if (!nurmon) {
                return null;
            }
            return nurmon;
        } catch (error) {
            console.error("Error fetching Nurmon by name:", error);
            throw error;
        }
    }

    async getNurmonsBySearch(query : string){
        try {
            const nurmons = await this.db.Nurmon.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${query}%`
                    }
                },
                include: [
                    {
                        model: this.db.Type,
                        as: 'type'
                    }
                ]
            });
            return nurmons;
        } catch (error) {
            console.error("Error fetching Nurmons by search query:", error);
            throw error;
        }
    }

    async createNurmon(nurmonData : NurmonCreateDTO){
        try{
            const existingNurmon = await this.db.Nurmon.findOne({
                where: {
                    name: nurmonData.name
                }
            });

            if (existingNurmon) {
                throw new Error("Nurmon with this name already exists");
            }

            const newNurmon = await this.db.Nurmon.create(nurmonData);
            return newNurmon;
        }catch(error){
            console.error("Error creating Nurmon:", error);
            throw error;
        }
    }

    async updateNurmon(id : number, nurmonData : NurmonUpdateDTO){
        try{
            const nurmon = await this.db.Nurmon.findByPk(id);
            if (!nurmon) {
                throw new Error("Nurmon not found");
            }

            nurmon.name = nurmonData.name || nurmon.name;
            nurmon.image_path = nurmonData.image_path || nurmon.image_path;
            nurmon.hp = nurmonData.hp || nurmon.hp;
            nurmon.def = nurmonData.def || nurmon.def;
            nurmon.attack = nurmonData.attack || nurmon.attack;
            nurmon.special_attack = nurmonData.special_attack || nurmon.special_attack;
            nurmon.special_def = nurmonData.special_defense || nurmon.special_def;
            nurmon.speed = nurmonData.speed || nurmon.speed;
            nurmon.first_ability_id = nurmonData.first_ability_id || nurmon.first_ability_id;
            nurmon.second_ability_id = nurmonData.second_ability_id || nurmon.second_ability_id;
            nurmon.third_ability_id = nurmonData.third_ability_id || nurmon.third_ability_id;

            await nurmon.save();
            return nurmon;
        }catch(error){
            console.error("Error updating Nurmon:", error);
            throw error;
        }
    }

    async deleteNurmon(id: number) {
        try {
            const nurmon = await this.db.Nurmon.findByPk(id);
            if (!nurmon) {
                throw new Error("Nurmon not found");
            }
            await nurmon.destroy();
            return { message: "Nurmon deleted successfully" };
        } catch (error) {
            console.error("Error deleting Nurmon:", error);
            throw error;
        }
    }

}

export { NurmonService }