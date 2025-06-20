import { AutoIncrement, Column, DataType, Default, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
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

    @Default(false)
    @Column(DataType.BOOLEAN)
    is_admin!: boolean;

    @HasMany(() => Team)
    teams!: Team[];

}