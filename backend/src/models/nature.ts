import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { NatureCreateDTO, NatureDTO } from "./dtos/nature.types";


@Table
export class Nature extends Model<NatureDTO, NatureCreateDTO>{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    buff_stat!: string;

    @Column(DataType.STRING)
    nerf_stat!: string;

    @Column(DataType.FLOAT)
    hp_multiplier!: number;

    @Column(DataType.FLOAT)
    def_multiplier!: number;

    @Column(DataType.FLOAT)
    attack_multiplier!: number;

    @Column(DataType.FLOAT)
    special_attack_multiplier!: number;

    @Column(DataType.FLOAT)
    special_def_multiplier!: number;

    @Column(DataType.FLOAT)
    speed_multiplier!: number;

} 