import { Request, RequestHandler, Response } from "express";
import TeamMemberService from "../services/team_member.service";
import { TeamMemberCreateDTO } from "../models/dtos/team_member.types";


class TeamMemberController {

    private readonly teamMemberService : TeamMemberService;

    constructor(teamMemberService : TeamMemberService) {
        this.teamMemberService = teamMemberService;
    }

    getAllTeamMembers : RequestHandler = async (req : Request, res : Response) => {
        try {
            const teamMembers = await this.teamMemberService.getAllTeamMembers();
            res.status(200).json(teamMembers);
        } catch (err) {
            console.error("Error fetching all team members:", err);
            res.status(500).json({ error: "Error while fetching the team members", data : err });
        }
    }

    getTeamMemberById : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid team member ID" });
            return;
        }

        try {
            const teamMember = await this.teamMemberService.teamMemberById(id);
            if (!teamMember) {
                res.status(404).json({ error: "Team member not found" });
                return;
            }
            res.status(200).json(teamMember);
        } catch (err) {
            console.error("Error fetching team member by ID:", err);
            res.status(500).json({ error: "Error retrieving data", data : err });
        }
    }

    getTeamMembersByTeamId : RequestHandler = async (req : Request, res : Response) => {
        const teamId = parseInt(req.params.teamId);
        if (isNaN(teamId)) {
            res.status(400).json({ error: "Invalid team ID" });
            return;
        }

        try {
            const teamMembers = await this.teamMemberService.getTeamMembersByTeamId(teamId);
            if (!teamMembers || teamMembers.length === 0) {
                res.status(404).json({ error: "No team members found for this team" });
                return;
            }
            res.status(200).json(teamMembers);
        } catch (err) {
            console.error("Error fetching team members by team ID:", err);
            res.status(500).json({ error: "Error retrieving data", data : err });
        }
    }
    createTeamMember : RequestHandler = async (req : Request, res : Response) => {
        try{
            const teamMemberData : TeamMemberCreateDTO = req.body;

            const errors = this.validateTeamMemberData(teamMemberData);
            if(errors){
                res.status(400).json(errors);
                return;
            }

            const createdTeamMember = await this.teamMemberService.createTeamMember(teamMemberData);
            res.status(201).json(createdTeamMember);
        }catch(err){
            console.error("Error creating team member:", err);
            res.status(500).json({ error: "Error while creating the team member", data : err });
        }
    }

    updateTeamMember : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid team member ID" });
            return;
        }

        try {
            const teamMemberData : TeamMemberCreateDTO = req.body;


            const updatedTeamMember = await this.teamMemberService.updateTeamMember(id, teamMemberData);
            if (!updatedTeamMember) {
                res.status(404).json({ error: "Team member not found" });
                return;
            }
            res.status(200).json(updatedTeamMember);
        } catch (err) {
            console.error("Error updating team member:", err);
            res.status(500).json({ error: "Error while updating the team member", data : err });
        }
    }

    deleteTeamMember : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid team member ID" });
            return;
        }

        try {
            await this.teamMemberService.deleteTeamMember(id);
            res.status(201).send({ message : "Team member deleted successfully" });
        } catch (err) {
            console.error("Error deleting team member:", err);
            res.status(500).json({ error: "Error while deleting the team member", data : err });
        }
    }

    private validateTeamMemberData(teamMemberData: TeamMemberCreateDTO) {
        const errors : any = {}

        if (!teamMemberData.nickname || teamMemberData.nickname.trim() === "") {
            errors.nickname = "Nickname is required";
        }

        if (!teamMemberData.nurmon_id) {
            errors.nurmon_id = "Nurmon ID is required";
        }

        if (!teamMemberData.team_id) {
            errors.team_id = "Team ID is required";
        }

        if (Object.keys(errors).length > 0) {
            return errors;
        }

        return null;
    }
}

export default TeamMemberController;