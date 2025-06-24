import { Request, RequestHandler, Response } from "express";
import { NurmonService } from "../services/nurmon.service";
import { NurmonCreateDTO, NurmonUpdateDTO } from "../models/dtos/nurmon.types";
import global_vars from "../config/global.config";

import path from 'path';
import { UploadedFile } from "express-fileupload";


class NurmonController{
    
    private nurmonService: NurmonService;
    constructor(nurmonService : NurmonService){
        this.nurmonService = nurmonService;
    }

    getAllNurmons : RequestHandler = async (req : Request, res : Response) => {
        try {
            const nurmons = await this.nurmonService.getAllNurmons();
            res.status(200).json(nurmons);
        } catch (error) {
            console.error("Error fetching all Nurmons:", error);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    }

    getNurmonById : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.status(400).json({ error: "Invalid Nurmon ID" });
            return;
        }

        try {
            const nurmon = await this.nurmonService.getNurmonById(id);
            if(!nurmon){
                res.status(404).json({ error: "Nurmon not found" });
                return;
            }
            res.status(200).json(nurmon);
        } catch (error) {
            console.error("Error fetching Nurmon by ID:", error);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    }

    getNurmonsBySearch : RequestHandler = async (req : Request, res : Response) => {
        let searchTerm = req.query.term as string;
        if(!searchTerm){
            searchTerm = "";
        }

        try {
            const nurmons = await this.nurmonService.getNurmonsBySearch(searchTerm);
            res.status(200).json(nurmons);
        } catch (error) {
            console.error("Error fetching Nurmons by search term:", error);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    }

    createNurmon : RequestHandler = async (req : Request, res : Response) => {
        console.log(req.body)
        if(!req.files || !req.files.image) {
            res.status(400).json({ error: "Nurmon image is required" });
            return;
        }

        const file = req.files.image;
        const imageFile = Array.isArray(file) ? file[0] : file as UploadedFile;

        try{

            const nurmonData : NurmonCreateDTO = req.body;

            const errors = this.validateNurmonData(nurmonData);
            if(errors){
                res.status(400).json({ error: "Invalid Nurmon data", details: errors });
                return;
            }

            const existingNurmon = await this.nurmonService.getNurmonByName(nurmonData.name);
            if(existingNurmon){
                res.status(400).json({ error: "Nurmon with this name already exists" });
                return;
            }

            nurmonData.image_path = "https://placehold.co/600x400" //placeholder

            const theNurmon = await this.nurmonService.createNurmon(nurmonData);
            if(!theNurmon){
                res.status(400).json({ error: "Nurmon with this name already exists" });
                return;
            }

            const uploadDir = global_vars.UPLOADS_FOLDER + "/nurmon";
            const fileName = `${theNurmon.id}_.jpg`;
            const filePath = path.join(uploadDir, fileName);

            imageFile.mv(filePath, async (error : Error) => {
                if (error) {
                    console.error("Error moving file:", error);
                    res.status(500).json({ error: "Error while uploading the image" });
                    return;
                }

                theNurmon.image_path = fileName;

                await theNurmon.save();
                res.status(201).json(theNurmon);
            })
        }catch(err){
            console.error("Error creating Nurmon:", err);
            res.status(500).json({ message: "Error while saving the nurmon", data : (err as Error).message });
            return;
        }
    }

    updateNurmon : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.status(400).json({ error: "Invalid Nurmon ID" });
            return;
        }

        try {

            const nurmonData : NurmonUpdateDTO = req.body;

            const updatedNurmon = await this.nurmonService.updateNurmon(id, nurmonData);
            if(!updatedNurmon){
                res.status(404).json({ error: "Nurmon not found" });
                return;
            }

            if(req.files && req.files.image) {
                const file = req.files.image;
                const imageFile = Array.isArray(file) ? file[0] : file as UploadedFile;

                const uploadDir = global_vars.UPLOADS_FOLDER + "/nurmon";
                const fileName = `${updatedNurmon.id}_.jpg`;
                const filePath = path.join(uploadDir, fileName);

                imageFile.mv(filePath, async (error : Error) => {
                    if (error) {
                        console.error("Error moving file:", error);
                        res.status(500).json({ error: "Error while uploading the image" });
                        return;
                    }

                    updatedNurmon.image_path = fileName;
                    await updatedNurmon.save();
                    console.log("Image path set to:", nurmonData.image_path);
                });
            }

            res.status(200).json(updatedNurmon);
        } catch (err) {
            console.error("Error updating Nurmon:", err);
            res.status(500).json({ error: "Error updating the Nurmon", data : (err as Error).message });
            return;
        }
    }

    deleteNurmon : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);

        try {
            await this.nurmonService.deleteNurmon(id);
            res.status(200).json({ message: "Nurmon deleted successfully" });
        } catch (err) {
            console.error("Error deleting Nurmon:", err);
            res.status(500).json({ error: "Erro deleting the nurmon", data : (err as Error).message });
            return;
        }
    }

    private validateNurmonData(nurmonData : NurmonCreateDTO){
        const errors : any =  {}

        if(!nurmonData.name){
            errors.name = "Nurmon name is required";
        }
        if(!nurmonData.hp){
            errors.hp = "Nurmon HP is required";
        }
        if(!nurmonData.def){
            errors.def = "Nurmon DEF is required";
        }

        if(!nurmonData.attack){
            errors.attack = "Nurmon attack is required";
        }

        if(!nurmonData.special_attack){
            errors.special_attack = "Nurmon special attack is required";
        }

        if(!nurmonData.special_def){
            errors.special_def = "Nurmon special defense is required";
        }
        if(!nurmonData.speed){
            errors.speed = "Nurmon speed is required";
        }

        if(Object.keys(errors).length > 0){
            return errors;
        }

        return null;
    }
}

export default NurmonController;