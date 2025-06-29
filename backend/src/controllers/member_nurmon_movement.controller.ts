import { Request, RequestHandler, Response } from "express";
import MemberNurmonMovementService from "../services/member_nurmon_movement.service";
import { MemberNurmonMovementCreateDTO, MemberNurmonMovementUpdateWithMovementDTO } from "../models/dtos/member_nurmon_movement.types";


class MemberNurmonMovementController {
    private readonly memberNurmonMovementService : MemberNurmonMovementService;

    constructor(memberNurmonMovementService: MemberNurmonMovementService) {
        this.memberNurmonMovementService = memberNurmonMovementService;
    }

    getAllMemberNurmonMovements : RequestHandler = async (req : Request, res : Response) => {
        try {
            const memberMovements = await this.memberNurmonMovementService.getAllMemberNurmonMovements();
            res.status(200).json(memberMovements);
            return;
        } catch (err) {
            console.error("Error fetching all member nurmon movements:", err);
            res.status(500).json({ error: "Internal server error", data : (err as Error).message });
        }
    }

    getMemberNurmonMovementById : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        try {
            const memberMovement = await this.memberNurmonMovementService.getMemberNurmonMovementById(id);
            if (!memberMovement) {
                res.status(404).json({ error: "Member nurmon movement not found" });
                return;
            }
            res.status(200).json(memberMovement);
        } catch (err) {
            console.error("Error fetching member nurmon movement by ID:", err);
            res.status(500).json({ error: "Internal server error", data : (err as Error).message });
        }
    }

    getAllMemberNurmonMovementsByTeamMemberId : RequestHandler = async (req : Request, res : Response) => {
        const teamMemberId = parseInt(req.params.teamMemberId);
        if (isNaN(teamMemberId)) {
            res.status(400).json({ error: "Invalid team member ID" });
            return;
        }
        try {
            const memberMovements = await this.memberNurmonMovementService.getAllMemberNurmonMovementsByTeamMemberId(teamMemberId);
            res.status(200).json(memberMovements);
        } catch (err) {
            console.error("Error fetching member nurmon movements by team member ID:", err);
            res.status(500).json({ error: "Internal server error", data : (err as Error).message });
        }
    }

    createMemberNurmonMovement : RequestHandler = async (req : Request, res : Response) => {
        try {
            const memberMovementData : MemberNurmonMovementCreateDTO = req.body;

            const validationErrors = this.validateMemberNurmonMovementData(memberMovementData);
            if (validationErrors) {
                res.status(400).json({ error: "Validation failed", data: validationErrors });
                return;
            }

            const newMemberMovement = await this.memberNurmonMovementService.createMemberNurmonMovement(memberMovementData);
            res.status(201).json(newMemberMovement);
        } catch (err) {
            console.error("Error creating member nurmon movement:", err);
            res.status(500).json({ error: "Internal server error", data : (err as Error).message });
        }
    }

    updateMemberNurmonMovement : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        try {
            const memberMovementData : MemberNurmonMovementCreateDTO = req.body;

            const validationErrors = this.validateMemberNurmonMovementData(memberMovementData);
            if (validationErrors) {
                res.status(400).json({ error: "Validation failed", data: validationErrors });
                return;
            }

            const updatedMemberMovement = await this.memberNurmonMovementService.updateMemberNurmonMovement(id, memberMovementData);
            if (!updatedMemberMovement) {
                res.status(404).json({ error: "Member nurmon movement not found" });
                return;
            }
            res.status(200).json(updatedMemberMovement);
        } catch (err) {
            console.error("Error updating member nurmon movement:", err);
            res.status(500).json({ error: "Internal server error", data : (err as Error).message });
        }
    }

    deleteMemberNurmonMovement : RequestHandler = async (req : Request, res : Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        try {
            const deleted = await this.memberNurmonMovementService.deleteMemberNurmonMovement(id);
            if (!deleted) {
                res.status(404).json({ error: "Member nurmon movement not found" });
                return;
            }
            res.status(204).send();
        } catch (err) {
            console.error("Error deleting member nurmon movement:", err);
            res.status(500).json({ error: "Internal server error", data : (err as Error).message });
        }
    }


    validateMemberNurmonMovementData = (data: MemberNurmonMovementCreateDTO) => {
        const errors : any = {}
        if (!data.team_member_id) {
            errors.team_member_id = "Team member ID is required";
        }

        if (!data.nurmon_movement_id) {
            errors.nurmon_movement_id = "Nurmon movement ID is required";
        }

        if (Object.keys(errors).length > 0) {
            return errors;
        }

        return null;

    }

}

export default MemberNurmonMovementController;