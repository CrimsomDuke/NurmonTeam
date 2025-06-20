import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { NurmonCreateDTO, NurmonDTO } from "./dtos/nurmon.types";
import { Type } from "./type";
import { Ability } from "./ability";
import { NurmonMovement } from "./nurmon_movement";


@Table
export class Nurmon extends Model<NurmonDTO, NurmonCreateDTO>{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    name!: string;

    @Column(DataType.STRING)
    image_path !: string;

    @Column(DataType.INTEGER)
    hp! : number;

    @Column(DataType.INTEGER)
    def! : number;

    @Column(DataType.INTEGER)
    attack! : number;

    @Column(DataType.INTEGER)
    special_attack! : number;

    @Column(DataType.INTEGER)
    special_def! : number;

    @Column(DataType.INTEGER)
    speed! : number;

    @Column(DataType.INTEGER)
    @ForeignKey(() => Type)
    type_id! : number;

    @BelongsTo(() => Type)
    type!: Type;

    @AllowNull
    @ForeignKey(() => Ability)
    @Column(DataType.INTEGER)
    first_ability_id! : number | null;

    @BelongsTo(() => Ability)
    first_ability!: Ability | null;

    @AllowNull
    @ForeignKey(() => Ability)
    @Column(DataType.INTEGER)
    second_ability_id! : number | null;

    @BelongsTo(() => Ability)
    second_ability!: Ability | null;

    @AllowNull
    @ForeignKey(() => Ability)
    @Column(DataType.INTEGER)
    third_ability_id! : number | null;

    @BelongsTo(() => Ability)
    third_ability!: Ability | null;

    @HasMany(() => NurmonMovement)
    nurmon_movements!: NurmonMovement[];
}