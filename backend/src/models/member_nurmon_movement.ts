import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { MemberNurmonMovementCreateDTO, MemberNurmonMovementDTO } from "./dtos/member_nurmon_movement.types";
import { TeamMember } from "./team_member";
import { NurmonMovement } from "./nurmon_movement";

@Table
export class MemberNurmonMovement extends Model<MemberNurmonMovementDTO, MemberNurmonMovementCreateDTO>{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id! : number;

    @ForeignKey(() => TeamMember)
    @Column(DataType.INTEGER)
    team_member_id! : number;

    @BelongsTo(() => TeamMember)
    teamMember!: TeamMember;

    @ForeignKey(() => NurmonMovement)
    @Column(DataType.INTEGER)
    nurmon_movement_id! : number;

    @BelongsTo(() => NurmonMovement)
    nurmonMovement!: NurmonMovement;
}