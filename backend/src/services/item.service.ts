import { Database } from "../models";
import { ItemCreateDTO, ItemUpdateDTO } from "../models/dtos/item.types";
import { Op } from "sequelize";


class ItemService {
    private db : Database;

    constructor(dbInst : Database){
        this.db = dbInst;
    }

    async getAllItems(){
        try{
            const items = await this.db.Item.findAll();
            return items;
        }catch(error){
            console.error("Error fetching all items:", error);
            throw error;
        }
    }

    async getItemById(id : number){
        try{
            const item = await this.db.Item.findByPk(id);
            if(!item){
                return null;
            }
            return item;
        }catch(error){
            console.error("Error fetching item by ID:", error);
            throw error;
        }
    }

    async getItemByName(name : string){
        try{
            const item = await this.db.Item.findOne({
                where: { name }
            });
            if(!item){
                return null;
            }
            return item;
        }catch(error){
            console.error("Error fetching item by name:", error);
            throw error;
        }
    }

    async getItemBySearch(searchTerm : string){
        try{
            const items = await this.db.Item.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${searchTerm}%`
                    }
                }
            });
            return items;
        }catch(error){
            console.error("Error fetching items by search term:", error);
            throw error;
        }
    }

    async createItem(itemData : ItemCreateDTO){
        try{
            const existingItem = await this.getItemByName(itemData.name);
            if(existingItem){
                throw new Error("Item with this name already exists");
            }

            const newItem = await this.db.Item.create(itemData);
            return newItem;
        }catch(error){
            console.error("Error createing item:", error);
            throw error;
        }
    }

    async updateItem(id : number, itemData : ItemUpdateDTO){
        try{
            const item = await this.getItemById(id);
            if(!item){
                throw new Error("Item not found");
            }

            item.name = itemData.name || item.name;
            item.description = itemData.description || item.description;
            item.image_path = itemData.image_path || item.image_path;
            await item.save();

            return item;
        }catch(error){
            console.error("Error updating item:", error);
            throw error;
        }
    }

    async deleteItem(id : number){
        try{
            const item = await this.getItemById(id);
            if(!item){
                throw new Error("Item not found");
            }

            await item.destroy();
            return { message: "Item deleted successfully" };
        }catch(error){
            console.error("Error deleting item:", error);
            throw error;
        }
    }
}

export default ItemService;