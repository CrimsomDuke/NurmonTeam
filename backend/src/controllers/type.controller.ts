import { Request, Response } from "express";
import TypeService from "../services/type.service";


class TypeController{

    private readonly typeService : TypeService;

    constructor(typeService : TypeService) {
        this.typeService = typeService;
    }

    getAllTypes = async (req: Request, res: Response) => {
        try {
            const types = await this.typeService.getAllTypes();
            res.status(200).json(types);
            return;
        } catch (err) {
            console.error("Error fetching all types:", err);
            res.status(500).json({ error: "Internal server error", data: (err as Error).message });
        }
    }

    getTypeById = async (req: Request, res: Response) => {
        try {
            const typeId = parseInt(req.params.id);
            if (isNaN(typeId)) {
                res.status(400).json({ error: "Invalid type ID" });
                return;
            }
            const type = await this.typeService.getTypeById(typeId);
            if (!type) {
                res.status(404).json({ error: "Type not found" });
                return;
            }
            res.status(200).json(type);
        } catch (err) {
            console.error("Error fetching type by ID:", err);
            res.status(500).json({ error: "Internal server error", data: (err as Error).message });
        }
    }

}

export default TypeController;