import { Model } from "sequelize-typescript";
import { TeamCreateDTO, TeamDTO } from "./dtos/team.types";
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user";

@Table
export class Team extends Model<TeamDTO, TeamCreateDTO>{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id! : number;

    @Column(DataType.STRING)
    name! : string;

    @Column(DataType.INTEGER)
    @ForeignKey(() => User)
    user_id! : number;

    @BelongsTo(() => User)
    user! : User;
}