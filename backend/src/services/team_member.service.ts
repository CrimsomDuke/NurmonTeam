import { Database } from "../models";
import { TeamMemberCreateDTO, TeamMemberUpdateDTO } from "../models/dtos/team_member.types";


class TeamMemberService {

    private readonly db : Database;
    constructor(dbInst : Database) {
        this.db = dbInst;
    }

    async getAllTeamMembers(){
        try{
            const teamMembers = await this.db.TeamMember.findAll({
                include : [
                    {
                        model : this.db.Team,
                        as : 'team',
                        attributes: ['id', 'name']
                    },
                    {
                        model : this.db.Nurmon,
                        as : 'nurmon',
                        attributes: ['id', 'name']
                    }
                ]
            });

            return teamMembers;
        }catch(error){
            console.error("Error fetching all team members:", error);
            throw error;
        }
    }

    async getTeamMemberById(id: number) {
        try {
            const teamMember = await this.db.TeamMember.findByPk(id, {
                include: [
                    {
                        model: this.db.Nurmon,
                        as: 'nurmon',
                        include : [
                            {
                                model : this.db.Type,
                                as : 'type',
                            }
                        ]
                    },
                    {
                        model : this.db.Nature,
                        as : 'nature'
                    },
                    {
                        model : this.db.Ability,
                        as : 'selected_ability'
                    },
                    {
                        model : this.db.Item,
                        as : 'item'
                    }
                ]
            });

            if (!teamMember) {
                return null;
            }

            return teamMember;
        } catch (error) {
            console.error("Error fetching team member by ID:", error);
            throw error;
        }
    }

    async getTeamMembersByTeamId(teamId : number){
        try {
            const teamMembers = await this.db.TeamMember.findAll({
                where: { team_id: teamId },
                include: [
                    {
                        model: this.db.Nurmon,
                        as: 'nurmon',
                        include : [
                            {
                                model : this.db.Type,
                                as : 'type',
                            }
                        ]
                    },
                    {
                        model : this.db.Nature,
                        as : 'nature'
                    },
                    {
                        model : this.db.Ability,
                        as : 'selected_ability'
                    },
                    {
                        model : this.db.Item,
                        as : 'item'
                    }
                ]
            });

            return teamMembers;
        } catch (error) {
            console.error("Error fetching team members by team ID:", error);
            throw error;
        }
    }

    async createTeamMember(teamMemberData : TeamMemberCreateDTO){
        try{
            const validationError = await this.validateTeamMemberData(teamMemberData, 'CREATE');
            if(validationError) {
                throw new Error(validationError);
            }

            const nurmon = await this.db.Nurmon.findByPk(teamMemberData.nurmon_id);
            if(!nurmon) {
                throw new Error('Nurmon not found');
            }

            if(!teamMemberData.nickname || teamMemberData.nickname.trim() === '') {
                teamMemberData.nickname = nurmon.name;
            }

            const newTeamMember = await this.db.TeamMember.create(teamMemberData);
            return newTeamMember;
        }catch(error){
            console.error("Error creating team member:", error);
            throw error;
        }
    }

    async updateTeamMember(id : number, teamMemberData : TeamMemberUpdateDTO){
        try{

            const teamMember = await this.db.TeamMember.findByPk(id);
            if(!teamMember){
                throw Error("team member not found");
            }

            const validationError = await this.validateTeamMemberData(teamMemberData as TeamMemberCreateDTO, 'UPDATE');
            if(validationError) {
                throw new Error(validationError);
            }

            teamMember.nickname = teamMemberData.nickname || teamMember.nickname;
            teamMember.nature_id = teamMemberData.nature_id || teamMember.nature_id;

            if(teamMemberData.selected_ability_id == 0){
                teamMember.selected_ability_id = null; //
            }else{
                teamMember.selected_ability_id = teamMemberData.selected_ability_id || teamMember.selected_ability_id;
            }

            if(teamMemberData.item_id == 0){
                teamMember.item_id = null;
            }else{
                teamMember.item_id = teamMemberData.item_id || teamMember.item_id;
            }

            teamMember.hp_ev = teamMemberData.hp_ev || teamMember.hp_ev;
            teamMember.attack_ev = teamMemberData.attack_ev || teamMember.attack_ev;
            teamMember.def_ev = teamMemberData.def_ev || teamMember.def_ev;
            teamMember.special_attack_ev = teamMemberData.special_attack_ev || teamMember.special_attack_ev;
            teamMember.special_def_ev = teamMemberData.special_def_ev || teamMember.special_def_ev;
            teamMember.speed_ev = teamMemberData.speed_ev || teamMember.speed_ev;

            teamMember.hp_iv = teamMemberData.hp_iv || teamMember.hp_iv;
            teamMember.attack_iv = teamMemberData.attack_iv || teamMember.attack_iv;
            teamMember.def_iv = teamMemberData.def_iv || teamMember.def_iv;
            teamMember.special_attack_iv = teamMemberData.special_attack_iv || teamMember.special_attack_iv;
            teamMember.special_def_iv = teamMemberData.special_def_iv || teamMember.special_def_iv;
            teamMember.speed_iv = teamMemberData.speed_iv || teamMember.speed_iv;

            await teamMember.save();

            return teamMember;
        }catch(err){
            console.log("Error while updating team member", err);
            throw err;
        }
    }

    async deleteTeamMember(id : number){
        try{
            const teamMember = await this.db.TeamMember.findByPk(id);
            if(!teamMember){
                throw Error("team member not found");
            }

            await teamMember.destroy();
        }catch(err){
            console.log("Error while deleting team member", err);
            throw err;
        }
    }

    private async validateTeamMemberData(teamMemberData: TeamMemberCreateDTO, operation : string) {

        const team = await this.db.Team.findByPk(teamMemberData.team_id, {
            include : [
                {
                    model: this.db.TeamMember,
                    as: 'teamMembers'
                }
            ]
        });
        if(!team) {
            return 'Team not found';
        }

        if(team.teamMembers && team.teamMembers.length >= 6 && operation == 'CREATE') {
            return 'Team is full, cannot add more members';
        }

        const nurmon = await this.db.Nurmon.findByPk(teamMemberData.nurmon_id);
        if(!nurmon) {
            return 'Nurmon not found';
        }

        if(teamMemberData.selected_ability_id && 
            teamMemberData.selected_ability_id != nurmon.first_ability_id &&
            teamMemberData.selected_ability_id != nurmon.second_ability_id &&
            teamMemberData.selected_ability_id != nurmon.third_ability_id) {
            return 'Selected ability is not valid for this Nurmon';
        }

        if(teamMemberData.hp_ev + teamMemberData.attack_ev +
            teamMemberData.def_ev + teamMemberData.special_attack_ev + 
            teamMemberData.special_def_ev + teamMemberData.speed_ev > 510) {
            return 'Total EVs exceed 510';
        }

        if(teamMemberData.hp_iv < 0 || teamMemberData.attack_iv < 0 ||
            teamMemberData.def_iv < 0 || teamMemberData.special_attack_iv < 0 ||
            teamMemberData.special_def_iv < 0 || teamMemberData.speed_iv < 0) {
            return 'IVs cannot be negative';
        }

        if(teamMemberData.hp_iv > 31 || teamMemberData.attack_iv > 31 ||
            teamMemberData.def_iv > 31 || teamMemberData.special_attack_iv > 31 ||
            teamMemberData.special_def_iv > 31 || teamMemberData.speed_iv > 31) {
            return 'IVs cannot exceed 31';
        }

        return null;
    }
}

export default TeamMemberService;