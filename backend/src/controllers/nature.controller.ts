import { Request, RequestHandler, Response } from "express";
import NatureService from "../services/nature.service";



class NatureController {
    private readonly natureService : NatureService;

    constructor(natureService : NatureService){
        this.natureService = natureService;
    }

    getAllNatures : RequestHandler = async (req : Request, res : Response) => {
        try{
            const natures = await this.natureService.getAllNatures();
            res.status(200).json(natures);
        }catch(error){
            console.error("Error fetching all natures:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    } 

    getNatureById : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid nature ID" });
            return;
        }

        try {
            const nature = await this.natureService.getNatureById(id);
            if (!nature) {
                res.status(404).json({ error: "Nature not found" });
                return;
            }
            res.status(200).json(nature);
        } catch (error) {
            console.error("Error fetching nature by ID:", error);
            res.status(500).json({ error: "Error retrieving data" });
        }
    }
}

export default NatureController;