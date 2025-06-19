import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ItemDTO } from "./dtos/item.types";


@Table
export class Item extends Model<ItemDTO>{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id! : number;

    @Column(DataType.STRING)
    name! : string;

    @Column(DataType.STRING)
    description! : string;

    @Column(DataType.STRING)
    image_path! : string;
}