import { Request, RequestHandler, Response } from "express";
import TeamService from "../services/team.service";
import { TeamCreateDTO, TeamUpdateDTO } from "../models/dtos/team.types";


class TeamController {
    private readonly teamService : TeamService;

    constructor(teamService : TeamService){
        this.teamService = teamService;
    }

    getAllTeams : RequestHandler = async (req : Request, res : Response) => {
        try {
            const teams = await this.teamService.getAllTeams();
            res.status(200).json(teams);
        } catch (err) {
            console.error("Error fetching all teams:", err);
            res.status(500).json({ error: "Internal server error", data: (err as Error).message });
        }
    }

    getTeamById : RequestHandler = async (req : Request, res : Response) => {
        try {
            const teamId = parseInt(req.params.id);
            if (isNaN(teamId)) {
                res.status(400).json({ error: "Invalid team ID" });
                return;
            }
            const team = await this.teamService.getTeamById(teamId);
            if (!team) {
                res.status(404).json({ error: "Team not found" });
                return;
            }
            res.status(200).json(team);
        } catch (err) {
            console.error("Error fetching team by ID:", err);
            res.status(500).json({ error: "Internal server error", data: (err as Error).message });
        }
    }

    getTeamByUserId : RequestHandler = async (req : Request, res : Response) => {
        try {
            const userId = parseInt(req.params.userId);
            if (isNaN(userId)) {
                res.status(400).json({ error: "Invalid user ID" });
                return;
            }
            const team = await this.teamService.getTeamByUserId(userId);
            if (!team) {
                res.status(404).json({ error: "Team not found for this user" });
                return;
            }
            res.status(200).json(team);
        } catch (err) {
            console.error("Error fetching team by user ID:", err);
            res.status(500).json({ error: "Error fetching teams by user id", data: (err as Error).message });
        }
    }

    createTeam : RequestHandler = async (req : Request, res : Response) => {
        try{
            const teamData : TeamCreateDTO = req.body;
            if(!teamData){
                res.status(400).json({ error: "Team data is required" });
                return;
            }

            const errors = this.validateTeamData(teamData);
            if(errors){
                res.status(400).json({ error: "Validation failed", data: errors });
                return;
            }

            const newTeam = await this.teamService.createTeam(teamData);
            res.status(201).json(newTeam);
        }catch(err){
            console.error("Error creating team:", err);
            res.status(500).json({ error: "Error creating the team", data: (err as Error).message });
        }
    }

    updateTeam : RequestHandler = async (req : Request, res : Response) => {
        try {
            const teamId = parseInt(req.params.id);
            if (isNaN(teamId)) {
                res.status(400).json({ error: "Invalid team ID" });
                return;
            }

            const teamData : TeamUpdateDTO = req.body;
            if(!teamData){
                res.status(400).json({ error: "Team data is required" });
                return;
            }

            const updatedTeam = await this.teamService.updateTeam(teamId, teamData);
            if (!updatedTeam) {
                res.status(404).json({ error: "Team not found" });
                return;
            }
            res.status(200).json(updatedTeam);
        } catch (err) {
            console.error("Error updating team:", err);
            res.status(500).json({ error: "Error updating Team", data: (err as Error).message });
        }
    }

    deleteTeam : RequestHandler = async (req : Request, res : Response) => {
        try {
            const teamId = parseInt(req.params.id);
            if (isNaN(teamId)) {
                res.status(400).json({ error: "Invalid team ID" });
                return;
            }

            await this.teamService.deleteTeam(teamId);
            res.status(200).json({ message: "Team deleted successfully" });
        } catch (err) {
            console.error("Error deleting team:", err);
            res.status(500).json({ error: "Error deleting", data: (err as Error).message });
        }
    }

    private validateTeamData(teamData: TeamCreateDTO) {
        const errors : any = {};

        if(!teamData.user_id){
            errors.user_id = "User ID is required";
        }

        if(!teamData.name){
            errors.name = "Team name is required";
        }

        if(Object.keys(errors).length > 0){
            return errors;
        }

        return null;

    }
}

export default TeamController;