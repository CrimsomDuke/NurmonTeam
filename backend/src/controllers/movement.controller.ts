import { Request, RequestHandler, Response } from "express";
import { MovementService } from "../services/movement.service";
import { MovementCreateDTO, MovementUpdateDTO } from "../models/dtos/movement.types";

class MovementController {

    private movementService: MovementService;
    constructor(movementService: MovementService) {
        this.movementService = movementService;
    }

    getAllMovements : RequestHandler = async (req : Request, res : Response) => {
        try {
            const movements = await this.movementService.getAllMovements();
            res.status(200).json(movements);
        } catch (error) {
            console.error("Error fetching all movements:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    getMovementById : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid movement ID" });
            return;
        }

        try {
            const movement = await this.movementService.getMovementById(id);
            if (!movement) {
                res.status(404).json({ error: "Movement not found" });
                return;
            }
            res.status(200).json(movement);
        } catch (error) {
            console.error("Error fetching movement by ID:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    getMovementByName : RequestHandler = async (req : Request, res : Response) => {
        const name = req.params.name;
        if (!name) {
            res.status(400).json({ error: "Movement name is required" });
            return;
        }

        try {
            const movement = await this.movementService.getMovementByName(name);
            if (!movement) {
                res.status(404).json({ error: "Movement not found" });
                return;
            }
            res.status(200).json(movement);
        } catch (error) {
            console.error("Error fetching movement by name:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    createMovement : RequestHandler = async (req : Request, res : Response) => {         
        try {

            const movementData : MovementCreateDTO = req.body;

            const errors = this.validateMovementData(movementData);
            if (errors) {
                res.status(400).json({ errors });
                return;
            }

            const existingMovement = await this.movementService.getMovementByName(movementData.name);
            if (existingMovement) {
                res.status(409).json({ error: "Movement with this name already exists" });
                return;
            }

            const newMovement = await this.movementService.createMovement(movementData);
            res.status(201).json(newMovement);
        } catch (error) {
            console.error("Error creating movement:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    updateMovement : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid movement ID" });
            return;
        }

        try {
            const movementData: MovementUpdateDTO = req.body;

            const updatedMovement = await this.movementService.updateMovement(id, movementData);
            if (!updatedMovement) {
                res.status(404).json({ error: "Movement not found" });
                return;
            }
            res.status(200).json(updatedMovement);
        } catch (error) {
            console.error("Error updating movement:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    deleteMovement : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid movement ID" });
            return;
        }

        try {
            const deletedMovement = await this.movementService.deleteMovement(id);
            if (!deletedMovement) {
                res.status(404).json({ error: "Movement not found" });
                return;
            }
            res.status(204).send({ message : "Movement deleted successfully" });
        } catch (error) {
            console.error("Error deleting movement:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    private validateMovementData(movementData: MovementCreateDTO){
        const errors : any = {};
        if (!movementData.name || typeof movementData.name !== 'string') {
            errors.name = "Name is required and must be a string";
        }
        if (typeof movementData.power !== 'number' || movementData.power < 0) {
            errors.power = "Power must be a non-negative number";
        }

        if (typeof movementData.is_physical !== 'boolean') {
            errors.is_physical = "is_physical must be a boolean";
        }

        if (!movementData.type_id || typeof movementData.type_id !== 'number') {
            errors.type_id = "Type ID is required and must be a number";
        }

        if( Object.keys(errors).length > 0) {
            return errors
        }
        return null;

    }

}

export { MovementController }