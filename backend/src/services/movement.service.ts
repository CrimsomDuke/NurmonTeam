import { Database } from "../models";
import { MovementCreateDTO, MovementUpdateDTO } from "../models/dtos/movement.types";


class MovementService {

    private readonly db: Database;
    constructor(dbInst : Database){
        this.db = dbInst;
    }

    getAllMovements = async () => {
        try{
            const movements = await this.db.Movement.findAll({
                include: [
                    {
                        model: this.db.Type,
                        as: 'type'
                    }
                ]
            });

        return movements;
        }catch (error) {
            console.error("Error fetching all movements:", error);
            throw error;
        }
    }

    getMovementById = async (id: number) => {
        try {
            const movement = await this.db.Movement.findByPk(id, {
                include: [
                    {
                        model: this.db.Type,
                        as: 'type'
                    }
                ]
            });
            if (!movement) {
                return null;
            }
            return movement;
        } catch (error) {
            console.error("Error fetching movement by ID:", error);
            throw error;
        }   
    }

    getMovementByName = async (name: string) => {
        try {
            const movement = await this.db.Movement.findOne({
                where: { name },
                include: [
                    {
                        model: this.db.Type,
                        as: 'type'
                    }
                ]
            });
            if (!movement) {
                return null;
            }
            return movement;
        } catch (error) {
            console.error("Error fetching movement by name:", error);
            throw error;
        }
    }

    createMovement = async (movementData: MovementCreateDTO) => {
        try {
            const existingMovement = await this.db.Movement.findOne({
                where: {
                    name: movementData.name
                }
            });

            if (existingMovement) {
                throw new Error("Movement with this name already exists");
            }

            const newMovement = await this.db.Movement.create(movementData);
            return newMovement;
        } catch (error) {
            console.error("Error creating movement:", error);
            throw error;
        }
    }

    updateMovement = async (id: number, movementData: MovementUpdateDTO) => {
        try {
            const movement = await this.getMovementById(id);
            if (!movement) {
                throw new Error("Movement not found");
            }

            movement.name = movementData.name || movement.name;
            movement.power = movementData.power || movement.power;
            movement.is_physical = movementData.is_physical !== undefined ? movementData.is_physical : movement.is_physical;
            movement.type_id = movementData.type_id || movement.type_id;

            await movement.save();
            return movement;

        } catch (error) {
            console.error("Error updating movement:", error);
            throw error;
        }
    }

    deleteMovement = async (id: number) => {
        try {
            const movement = await this.getMovementById(id);
            if (!movement) {
                throw new Error("Movement not found");
            }

            await movement.destroy();
            return { message: "Movement deleted successfully" };
        } catch (error) {
            console.error("Error deleting movement:", error);
            throw error;
        }
    }

}

export { MovementService };