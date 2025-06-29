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
            res.status(500).json({ error: "Error retrieving data" });
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
        } catch (err) {
            console.error("Error fetching movement by name:", err);
            res.status(500).json({ error: "Error fetching movement by name" });
        }
    }

    getPossibleMovementsByNurmonIdForSearch : RequestHandler = async (req : Request, res : Response) => {
        const nurmonId = parseInt(req.params.id);
        const searchTerm = req.query.term as string;
        if (isNaN(nurmonId)) {
            res.status(400).json({ error: "Invalid nurmon ID" });
            return;
        }

        try{
            const movements = await this.movementService.getPossibleMovementsByNurmonIdForSearch(nurmonId, searchTerm);
            res.status(200).json(movements);
            return;
        }catch(err){
            console.error("Error fetching possible movements by nurmon ID for search:", err);
            res.status(500).json({ error: "Error fetching possible movements", data : (err as Error).message });
        }

    }

    getCurrentMovementsByTeamMemberId : RequestHandler = async (req : Request, res : Response) => {
        const teamMemberId = parseInt(req.params.id);
        if (isNaN(teamMemberId)) {
            res.status(400).json({ error: "Invalid team member ID" });
            return;
        }

        try {
            const movements = await this.movementService.getCurrentMovementsByTeamMemberId(teamMemberId);
            res.status(200).json(movements);
        } catch (err) {
            console.error("Error fetching current movements by team member ID:", err);
            res.status(500).json({ error: "Error fetching current movements", data : (err as Error).message });
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
        } catch (err) {
            console.error("Error creating movement:", err);
            res.status(500).json({ error: "Error creating the movement", data : (err as Error).message });
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
        } catch (err) {
            console.error("Error updating movement:", err);
            res.status(500).json({ error: "Error  updating the movement", data : (err as Error).message });
        }
    }

    deleteMovement : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid movement ID" });
            return;
        }

        try {
            await this.movementService.deleteMovement(id);
            res.status(201).send({ message : "Movement deleted successfully" });
        } catch (err) {
            console.error("Error deleting movement:", err);
            res.status(500).json({ error: "Error deleting the movement", data : (err as Error).message });
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

        if (!movementData.type_id) {
            errors.type_id = "Type ID is required and must be a number";
        }

        if( Object.keys(errors).length > 0) {
            return errors
        }
        return null;

    }

}

export { MovementController }