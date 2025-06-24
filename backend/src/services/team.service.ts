import { Database } from "../models";
import { TeamCreateDTO, TeamUpdateDTO } from "../models/dtos/team.types";

class TeamService{
    private readonly db : Database;

    constructor(dbInst : Database){
        this.db = dbInst;
    }

    async getAllTeams(){
        try{
            const teams = await this.db.Team.findAll();
            return teams;
        }catch(err){
            console.error("Error fetching all teams:", err);
            throw err;
        }
    }

    async getTeamById(id: number){
        try {
            const team = await this.db.Team.findByPk(id);
            if (!team) {
                return null;
            }
            return team;
        } catch (err) {
            console.error("Error fetching team by ID:", err);
            throw err;
        }
    }

    async getTeamsByUserId(userId : number){
        try {
            const teams = await this.db.Team.findAll({
                where: {
                    user_id: userId
                },
                include : {
                    model : this.db.TeamMember,
                    as: 'teamMembers',
                    include: [{
                        model: this.db.Nurmon,
                        as: 'nurmon'
                    }]
                }
            });

            return teams;
        } catch (err) {
            console.error("Error fetching team by user ID:", err);
            throw err;
        }
    }

    async createTeam(teamData : TeamCreateDTO){
        try {
            const team = await this.db.Team.create(teamData);
            return team;
        } catch (err) {
            console.error("Error creating team:", err);
            throw err;
        }
    }

    async updateTeam(teamId : number, teamData : TeamUpdateDTO){
        try {
            const team = await this.db.Team.findByPk(teamId);
            if (!team) {
                throw new Error("Team not found");
            }

            team.name = teamData.name || team.name;

            return team;
        } catch (err) {
            console.error("Error updating team:", err);
            throw err;
        }
    }

    async deleteTeam(teamId : number){
        try {
            const team = await this.db.Team.findByPk(teamId);
            if (!team) {
                throw new Error("Team not found");
            }

            await team.destroy();
            return { message: "Team deleted successfully" };
        } catch (err) {
            console.error("Error deleting team:", err);
            throw err;
        }
    }
}

export default TeamService;