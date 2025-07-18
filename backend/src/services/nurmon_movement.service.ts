import { Database } from "../models";
import { NurmonMovementCreateDTO, NurmonMovementUpdateDTO } from "../models/dtos/nurmon_movement.types";
import { Op } from "sequelize";

class NurmonMovementService {
    private readonly db : Database;

    constructor(dbInst : Database){
        this.db = dbInst;
    }

    async getAllNurmonMovements(){
        try{
            const movements = await this.db.NurmonMovement.findAll({
                include: [
                    {
                        model: this.db.Nurmon,
                        as: 'nurmon',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: this.db.Movement,
                        as: 'movement'
                    }
                ]
            });

            return movements;
        }catch(error){
            console.error("Error fetching all Nurmon movements:", error);
            throw error;
        }
    }

    async getNurmonMovementById(id: number){
        try{
            const movement = await this.db.NurmonMovement.findByPk(id, {
                include: [
                    {
                        model: this.db.Nurmon,
                        as: 'nurmon',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: this.db.Movement,
                        as: 'movement'
                    }
                ]
            });

            if (!movement) {
                return null;
            }

            return movement;
        }catch(error){
            console.error("Error fetching Nurmon movement by ID:", error);
            throw error;
        }
    }

    async getNurmonMovementsByNurmonId(nurmonId: number){
        try{
            const movements = await this.db.NurmonMovement.findAll({
                where: { nurmon_id: nurmonId },
                include: [
                    {
                        model: this.db.Nurmon,
                        as: 'nurmon',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: this.db.Movement,
                        as: 'movement',
                        include : [
                            {
                                model: this.db.Type,
                                as: 'type',
                                attributes: ['id', 'name']
                            }
                        ]
                    }
                ]
            });

            return movements;
        }catch(error){
            console.error("Error fetching Nurmon movements by Nurmon ID:", error);
            throw error;
        }
    }

    async getNurmonMovementsForSearch(nurmonId : number, searchTerm: string){
        try{
            const movements = await this.db.NurmonMovement.findAll({
                where: { nurmon_id: nurmonId },
                include: [
                    {
                        model: this.db.Movement,
                        as: 'movement',
                        where : {
                            name : {
                                [Op.like]: `%${searchTerm}%`
                            }
                        },
                        include: [
                            {
                                model: this.db.Type,
                                as: 'type',
                                attributes: ['id', 'name']
                            }
                        ]
                    }
                ]
            });

            return movements;
        }catch(error){
            console.error("Error fetching Nurmon movements for search:", error);
            throw error;
        }
    }

    async createNurmonMovement(nurmonMovementData: NurmonMovementCreateDTO){
        try{

            const existingMovement = await this.db.NurmonMovement.findOne({
                where: {
                    nurmon_id: nurmonMovementData.nurmon_id,
                    movement_id: nurmonMovementData.movement_id
                }
            });

            if (existingMovement) {
                throw new Error("Nurmon movement already exists for this Nurmon and Movement.");
            }

            const newMovement = await this.db.NurmonMovement.create(nurmonMovementData);
            return newMovement;
        }catch(error){
            console.error("Error creating Nurmon movement:", error);
            throw error;
        }
    }

    async deleteNurmonMovement(id: number){
        try{
            const movement = await this.db.NurmonMovement.findByPk(id);
            if (!movement) {
                throw new Error("Nurmon movement not found.");
            }

            await movement.destroy();
            return { message: "Nurmon movement deleted successfully." };
        }catch(error){
            console.error("Error deleting Nurmon movement:", error);
            throw error;
        }
    }
}

export default NurmonMovementService;