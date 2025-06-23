import { Request, RequestHandler, Response } from "express";
import ItemService from "../services/item.service";
import { ItemCreateDTO, ItemUpdateDTO } from "../models/dtos/item.types";
import global_vars from "../config/global.config";

import path from 'path';
import { UploadedFile } from "express-fileupload";


class ItemController {
    
    private readonly itemService : ItemService;

    constructor(itemService : ItemService){
        this.itemService = itemService;
    }

    getAllItem : RequestHandler = async (req : Request, res : Response) => {
        try {
            const items = await this.itemService.getAllItems();
            res.status(200).json(items);
        } catch (error) {
            console.error("Error fetching all items:", error);
            res.status(500).json({ error: "Error fetching the items", data : error });
        }
    }

    getItemById : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.status(400).json({ error: "Invalid item ID" });
            return;
        }

        try {
            const item = await this.itemService.getItemById(id);
            if(!item){
                res.status(404).json({ error: "Item not found" });
                return;
            }
            res.status(200).json(item);
        } catch (error) {
            console.error("Error fetching item by ID:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    getItemByName : RequestHandler = async (req : Request, res : Response) => {
        const name = req.params.name;
        if(!name){
            res.status(400).json({ error: "Item name is required" });
            return;
        }

        try {
            const item = await this.itemService.getItemByName(name);
            if(!item){
                res.status(404).json({ error: "Item not found" });
                return;
            }
            res.status(200).json(item);
        } catch (error) {
            console.error("Error fetching item by name:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    getItemsBySearch : RequestHandler = async (req : Request, res : Response) => {
        const searchTerm = req.query.term as string;
        if(!searchTerm){
            res.status(400).json({ error: "Search term is required" });
            return;
        }

        try {
            const items = await this.itemService.getItemBySearch(searchTerm);
            res.status(200).json(items);
        } catch (error) {
            console.error("Error fetching items by search term:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    createItem : RequestHandler = async (req : Request, res : Response) => {
        if(!req.files || !req.files.image){
            res.status(400).json({ error: "Item image is required" });
            return;
        }

        const file = req.files.image;
        const imageFile = Array.isArray(file) ? file[0] : file as UploadedFile;

        try{
            const itemData : ItemCreateDTO = req.body;

            const errors = this.validateItemData(itemData);
            if(errors){
                res.status(400).json({ error: "Invalid data for creating an Item", data: errors });
                return;
            }

            itemData.image_path = "https://placehold.co/600x400";

            const theItem = await this.itemService.createItem(itemData);
            if(!theItem){
                res.status(400).json({ error: "The item could not be created" });
                return;
            }

            const uploadDir = global_vars.UPLOADS_FOLDER + "/item";
            const fileName = `${theItem.id}_.jpg`;
            const filePath = path.join(uploadDir, fileName);

            imageFile.mv(filePath, async (error : Error) => {
                if(error){
                    console.error("Error moving image file:", error);
                    res.status(500).json({ error: "Failed to upload item image" });
                    return;
                }

                theItem.image_path = fileName;;
                await theItem.save();

                res.status(201).json(theItem);
            })

        }catch(err){
            console.error("Error creating item:", err);
            res.status(500).json({ error: "Error  creating the item ", data : (err as Error).message });
            return;
        }
    }

    updateItem : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.status(400).json({ error: "Invalid Nurmon ID" });
            return;
        }

        try{
            const itemData : ItemUpdateDTO = req.body;

            const updatedItem = await this.itemService.updateItem(id, itemData);
            if(!updatedItem){
                res.status(404).json({ error: "Item could not be updated" });
                return;
            }

            if(req.files && req.files.image){
                const file = req.files.image;
                const imageFile = Array.isArray(file) ? file[0] : file as UploadedFile;

                const uploadDir = global_vars.UPLOADS_FOLDER + "/item";
                const fileName = `${updatedItem.id}_.jpg`;
                const filePath = path.join(uploadDir, fileName);

                imageFile.mv(filePath, async (error : Error) => {
                    if(error){
                        console.error("Error moving image file:", error);
                        res.status(500).json({ error: "Failed to upload item image" });
                        return;
                    }

                    updatedItem.image_path = fileName;
                    await updatedItem.save();
                })
            }

            res.status(200).json(updatedItem);
        }catch(err){
            console.error("Error updating item:", err);
            res.status(500).json({ error: "Error updating the item", data : (err as Error).message });
            return;
        }

    }

    deleteItem : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.status(400).json({ error: "Invalid item ID" });
            return;
        }

        try {
            await this.itemService.deleteItem(id);
            res.status(200).json({ message: "Item deleted successfully" });
        } catch (err) {
            console.error("Error deleting item:", err);
            res.status(500).json({ error: "Error deleting the item ", data : (err as Error).message });
        }
    }

    private validateItemData(itemData : ItemCreateDTO){
        const errors : any  = {};

        if(!itemData.name){
            errors.name = "Item name is required";
        }
        if(!itemData.description){
            errors.description = "Item description is required";
        }

        if(Object.keys(errors).length > 0){
            return errors;
        }

        return null;

    }

}

export default ItemController;