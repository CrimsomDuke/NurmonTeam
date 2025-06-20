import { AutoIncrement, BelongsTo, BelongsToMany, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { TypeCreateDTO, TypeDTO } from "./dtos/type.types";
import { Movement } from "./movement";
import { Nurmon } from "./nurmon";

@Table
export class Type extends Model<TypeDTO, TypeCreateDTO>{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id! : number;

    @Column(DataType.STRING)
    name! : string;

    @HasMany(() => Movement)
    movements!: Movement[];

    @HasMany(() => Nurmon)
    nurmons!: Nurmon[];
}