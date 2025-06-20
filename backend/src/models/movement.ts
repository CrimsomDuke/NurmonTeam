import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { MovementCreateDTO, MovementDTO } from "./dtos/movement.types";
import { Type } from "./type";
import { NurmonMovement } from "./nurmon_movement";

@Table
export class Movement extends Model<MovementDTO, MovementCreateDTO>{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id! : number;

    @Unique
    @Column(DataType.STRING)
    name! : string;

    @Column(DataType.BOOLEAN)
    is_physical! : boolean;

    @Column(DataType.INTEGER)
    power! : number;

    @Column(DataType.INTEGER)
    @ForeignKey(() => Type)
    type_id! : number; 

    @BelongsTo(() => Type)
    type!: Type;

    @HasMany(() => NurmonMovement)
    nurmon_movements!: NurmonMovement[];
} 