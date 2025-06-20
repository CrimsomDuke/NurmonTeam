import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { AbilityCreateDTO, AbilityDTO } from "./dtos/ability.types";

@Table
export class Ability extends Model<AbilityDTO, AbilityCreateDTO>{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id! : number;

    @Unique
    @Column(DataType.STRING)
    name! : string;

    @Column(DataType.STRING)
    description! : string;
}