import { Request, Response } from "express";
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

}

export default AbilityController;  