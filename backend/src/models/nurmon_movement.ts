import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { NurmonMovementDTO } from "./dtos/nurmon_movement.types";
import { Nurmon } from "./nurmon";
import { Movement } from "./movement";

@Table
export class NurmonMovement extends Model<NurmonMovementDTO, NurmonMovementDTO>{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id! : number;

    @ForeignKey(() => Nurmon)
    @Column(DataType.INTEGER)
    nurmon_id! : number;

    @BelongsTo(() => Nurmon)
    nurmon!: Nurmon;

    @ForeignKey(() => Movement)
    @Column(DataType.INTEGER)
    movement_id! : number;

    @BelongsTo(() => Movement)
    movement!: Movement;

}