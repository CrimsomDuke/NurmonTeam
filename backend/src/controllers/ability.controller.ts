import { Request, RequestHandler, Response } from "express";
import AbilityService from "../services/ability.service";


class AbilityController{

    private readonly abilityService : AbilityService;

    constructor(abilityService : AbilityService) {
        this.abilityService = abilityService;
    }

    getAllAbilities = async (req: Request, res: Response) => {
        try {
            const abilities = await this.abilityService.getAllAbilities();
            res.status(200).json(abilities);
            return;
        } catch (err) {
            console.error("Error fetching all abilities:", err);
            res.status(500).json({ error: "Internal server error", data: (err as Error).message });
        }
    }

    getAbilityById = async (req: Request, res: Response) => {
        try {
            const abilityId = parseInt(req.params.id);
            if (isNaN(abilityId)) {
                res.status(400).json({ error: "Invalid ability ID" });
                return;
            }
            const ability = await this.abilityService.getAbilityById(abilityId);
            if (!ability) {
                res.status(404).json({ error: "Ability not found" });
                return;
            }
            res.status(200).json(ability);
        } catch (err) {
            console.error("Error fetching ability by ID:", err);
            res.status(500).json({ error: "Internal server error", data: (err as Error).message });
        }
    }

    getAbilitiesByNurmonId = async (req: Request, res: Response) => {
        try {
            const nurmonId = parseInt(req.params.id);
            if (isNaN(nurmonId)) {
                res.status(400).json({ error: "Invalid Nurmon ID" });
                return;
            }
            const abilities = await this.abilityService.getAbilitiesByNurmonId(nurmonId);
            res.status(200).json(abilities);
        } catch (err) {
            console.error("Error fetching abilities by Nurmon ID:", err);
            res.status(500).json({ error: "Internal server error", data: (err as Error).message });
        }
    }

    getAbilitiesBySearch = async (req: Request, res: Response) => {
        try {
            const searchTerm = req.query.term as string;
            if (!searchTerm) {
                res.status(400).json({ error: "Search term is required" });
                return;
            }
            const abilities = await this.abilityService.getAbilitiesBySearch(searchTerm);
            res.status(200).json(abilities);
        } catch (err) {
            console.error("Error fetching abilities by search:", err);
            res.status(500).json({ error: "Internal server error", data: (err as Error).message });
        }
    }

    createAbility : RequestHandler = async (req : Request, res : Response) => {
        try {
            const abilityData = req.body;
            if (!abilityData.name || !abilityData.description) {
                res.status(400).json({ error: "Name and description are required" });
                return;
            }
            const newAbility = await this.abilityService.createAbility(abilityData);

            console.info("Ability created successfully:", newAbility);

            res.status(201).json(newAbility);
        } catch (err) {
            console.error("Error creating ability:", err);
            res.status(500).json({ error: "Internal server error", data: (err as Error).message });
        }
    }

    updateAbility : RequestHandler = async(req : Request, res : Response) => {
        try{
            const abilityId = parseInt(req.params.id);
            if (isNaN(abilityId)) {
                res.status(400).json({ error: "Invalid ability ID" });
                return;
            }
            const abilityData = req.body;
            const updatedAbility = await this.abilityService.updateAbility(abilityId, abilityData);

            console.info("Ability updated successfully:", updatedAbility);
            
            res.status(200).json(updatedAbility);
        }catch(err){
            console.error("Error updating ability:", err);
            res.status(500).json({ error: "Internal server error", data: (err as Error).message });
        }
    }

    deleteAbility : RequestHandler = async(req : Request, res : Response) => {
        try {
            const abilityId = parseInt(req.params.id);
            if (isNaN(abilityId)) {
                res.status(400).json({ error: "Invalid ability ID" });
                return;
            }
            await this.abilityService.deleteAbility(abilityId);
            console.info("Ability deleted successfully:", abilityId);
            res.status(200).send({ message : "Ability deleted successfully" });
        } catch (err) {
            console.error("Error deleting ability:", err);
            res.status(500).json({ error: "Internal server error", data: (err as Error).message });
        }
    }

}

export default AbilityController;  