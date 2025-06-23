import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, HasOne, Max, Min, Model, PrimaryKey, Table } from "sequelize-typescript";
import { TeamCreateDTO } from "./dtos/team.types";
import { TeamMemberCreateDTO, TeamMemberDTO } from "./dtos/team_member.types";
import { MemberNurmonMovement } from "./member_nurmon_movement";
import { Ability } from "./ability";
import { Item } from "./item";
import { Nature } from "./nature";
import { Team } from "./team";
import { Nurmon } from "./nurmon";


@Table
export class TeamMember extends Model<TeamMemberDTO, TeamMemberCreateDTO>{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id! : number;

    @Column(DataType.STRING)
    nickname! : string;

    @ForeignKey(() => Nurmon)
    @Column(DataType.INTEGER)
    nurmon_id! : number;

    @BelongsTo(() => Nurmon)
    nurmon!: Nurmon;

    @ForeignKey(() => Team)
    @Column(DataType.INTEGER)
    team_id! : number;

    @BelongsTo(() => Team)
    team!: Team;

    @AllowNull
    @ForeignKey(() => Nature)
    @Column(DataType.INTEGER)
    nature_id! : number | null;

    @BelongsTo(() => Nature)
    nature!: Nature | null;

    @AllowNull
    @ForeignKey(() => Ability)
    @Column(DataType.INTEGER)
    selected_ability_id! : number | null;

    @BelongsTo(() => Ability)
    selected_ability!: Ability | null;

    @AllowNull
    @ForeignKey(() => Item)
    @Column(DataType.INTEGER)
    item_id! : number | null;

    @BelongsTo(() => Item)
    item!: Item | null;

    @Default(0)
    @Min(0)
    @Column(DataType.INTEGER)
    hp_ev! : number;

    @Default(0)
    @Min(0)
    @Column(DataType.INTEGER)
    attack_ev! : number;

    @Default(0)
    @Min(0)
    @Column(DataType.INTEGER)
    def_ev! : number;

    @Default(0)
    @Min(0)
    @Column(DataType.INTEGER)
    special_attack_ev! : number;

    @Default(0)
    @Min(0)
    @Column(DataType.INTEGER)
    special_def_ev! : number;

    @Default(0)
    @Min(0)
    @Column(DataType.INTEGER)
    speed_ev! : number;

    @Default(31)
    @Max(31)
    @Min(0)
    @Column(DataType.INTEGER)
    hp_iv! : number;

    @Default(31)
    @Max(31)
    @Min(0)
    @Column(DataType.INTEGER)
    attack_iv! : number;

    @Default(31)
    @Max(31)
    @Min(0)
    @Column(DataType.INTEGER)
    def_iv! : number;

    @Default(31)
    @Max(31)
    @Min(0)
    @Column(DataType.INTEGER)
    special_attack_iv! : number;

    @Default(31)
    @Max(31)
    @Min(0)
    @Column(DataType.INTEGER)
    special_def_iv! : number;

    @Default(31)
    @Max(31)
    @Min(0)
    @Column(DataType.INTEGER)
    speed_iv! : number;

    @HasMany(() => MemberNurmonMovement)
    member_nurmon_movements!: MemberNurmonMovement[];
}