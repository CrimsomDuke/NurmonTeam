import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { UserDTO, UserRegisterDTO } from "./dtos/user.types";
import { Team } from "./team";


@Table
export class User extends Model<UserDTO, UserRegisterDTO>{
    
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Unique
    @Column(DataType.STRING)
    username!: string;

    @Column(DataType.STRING)
    password!: string;

    @Unique
    @Column(DataType.STRING)
    email!: string;

    @HasMany(() => Team)
    teams!: Team[];

}