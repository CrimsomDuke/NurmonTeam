import { Request, RequestHandler, Response } from "express";
import NurmonMovementService from "../services/nurmon_movement.service";
import { NurmonMovementCreateDTO } from "../models/dtos/nurmon_movement.types";


class NurmonMovementController {
    private readonly nurmonMovementService : NurmonMovementService;

    constructor(nurmonMovementService : NurmonMovementService){
        this.nurmonMovementService = nurmonMovementService;
    }

    getAllNurmonMovements : RequestHandler = async (req : Request, res : Response) => {
        try {
            const movements = await this.nurmonMovementService.getAllNurmonMovements();
            res.status(200).json(movements);
        } catch (err) {
            console.error("Error fetching all Nurmon movements:", err);
            res.status(500).json({ error: "Error fetching nurmon movements", data : (err as Error).message });
        }
    }

    getNurmonMovementById : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid Nurmon movement ID" });
            return;
        }

        try {
            const movement = await this.nurmonMovementService.getNurmonMovementById(id);
            if (!movement) {
                res.status(404).json({ error: "Nurmon movement not found" });
                return;
            }
            res.status(200).json(movement);
        } catch (err) {
            console.error("Error fetching Nurmon movement by ID:", err);
            res.status(500).json({ error: "Error retrieving Nurmon movement data", data : (err as Error).message });
        }
    }

    getNurmonMovementsByNurmonId : RequestHandler = async (req : Request, res : Response) => {
        const nurmonId = parseInt(req.params.nurmonId);
        if (isNaN(nurmonId)) {
            res.status(400).json({ error: "Invalid Nurmon ID" });
            return;
        }

        try {
            const movements = await this.nurmonMovementService.getNurmonMovementsByNurmonId(nurmonId);
            if (!movements) {
                res.status(404).json({ error: "No movements found for this Nurmon" });
                return;
            }
            res.status(200).json(movements);
        } catch (err) {
            console.error("Error fetching Nurmon movements by Nurmon ID:", err);
            res.status(500).json({ error: "Error retrieving Nurmon movements", data : (err as Error).message });
        }
    }

    createNurmonMovement : RequestHandler = async (req : Request, res : Response) => {
        const nurmonMovementData : NurmonMovementCreateDTO = req.body;

        if (!nurmonMovementData || !nurmonMovementData.nurmon_id || !nurmonMovementData.movement_id) {
            res.status(400).json({ error: "Nurmon ID and movement ID are required" });
            return;
        }

        try {
            const newMovement = await this.nurmonMovementService.createNurmonMovement(nurmonMovementData);
            res.status(201).json(newMovement);
        } catch (err) {
            console.error("Error creating Nurmon movement:", err);
            res.status(500).json({ error: "Error creating Nurmon movement", data : (err as Error).message });
        }
    }

    deleteNurmonMovement : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid Nurmon movement ID" });
            return;
        }

        try {
            const deleted = await this.nurmonMovementService.deleteNurmonMovement(id);
            if (!deleted) {
                res.status(404).json({ error: "Nurmon movement not found" });
                return;
            }
            res.status(200).send({ message: "Nurmon movement deleted successfully" });
        } catch (err) {
            console.error("Error deleting Nurmon movement:", err);
            res.status(500).json({ error: "Error deleting Nurmon movement", data : (err as Error).message });
        }
    }
}

export default NurmonMovementController;