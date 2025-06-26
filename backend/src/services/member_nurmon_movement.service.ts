import { Database } from "../models";
import { MemberNurmonMovementCreateDTO } from "../models/dtos/member_nurmon_movement.types";


class MemberNurmonMovementService {

    private readonly db : Database;
    constructor(dbInst : Database){
        this.db = dbInst;
    }

    async getAllMemberNurmonMovements(){
        try {
                const memberMovements = await this.db.MemberNurmonMovement.findAll({
                include : [
                    {
                        model : this.db.NurmonMovement,
                        as: 'nurmonMovement',
                        include: [
                            {
                                model : this.db.Movement,
                                as: 'movement' 
                            }
                        ]
                    },
                    {
                        model : this.db.TeamMember,
                        as: 'teamMember',
                        include: [
                            {
                                model: this.db.Nurmon,
                                as: 'nurmon'
                            }
                        ]
                    }
                ]
            });

            return memberMovements;
        } catch (err) {
            console.error("Error fetching all member nurmon movements:", err);
            throw err;
        }
    }

    async getMemberNurmonMovementById(id: number){
        try {
            const memberMovement = await this.db.MemberNurmonMovement.findByPk(id, {
                include : [
                    {
                        model : this.db.NurmonMovement,
                        as: 'nurmonMovement',
                        include: [
                            {
                                model : this.db.Movement,
                                as: 'movement' 
                            }
                        ]
                    },
                    {
                        model : this.db.TeamMember,
                        as: 'teamMember',
                        include: [
                            {
                                model: this.db.Nurmon,
                                as: 'nurmon'
                            }
                        ]
                    }
                ]
            });

            if (!memberMovement) {
                return null;
            }
            return memberMovement;
        } catch (err) {
            console.error("Error fetching member nurmon movement by ID:", err);
            throw err;
        }
    }

    async getAllMemberNurmonMovementsByTeamMemberId(teamMemberId: number){
        try {
            const memberMovements = await this.db.MemberNurmonMovement.findAll({
                where: {
                    team_member_id: teamMemberId
                },
                include : [
                    {
                        model : this.db.NurmonMovement,
                        as: 'nurmonMovement',
                        include: [
                            {
                                model : this.db.Movement,
                                as: 'movement' 
                            }
                        ]
                    }
                ]
            });

            return memberMovements;
        } catch (err) {
            console.error("Error fetching member nurmon movements by team member ID:", err);
            throw err;
        }
    }

    async createMemberNurmonMovement(memberNurmonMovementData : MemberNurmonMovementCreateDTO){
        try {
            await this.validateMemberNurmonMovementData(memberNurmonMovementData);

            const memberMovement = await this.db.MemberNurmonMovement.create(memberNurmonMovementData);
            return memberMovement;
        } catch (err) {
            console.error("Error creating member nurmon movement:", err);
            throw err;
        }
    }

    async deleteMemberNurmonMovement(id: number){
        try {
            const memberMovement = await this.db.MemberNurmonMovement.findByPk(id);
            if (!memberMovement) {
                throw new Error("Member nurmon movement not found");
            }

            await memberMovement.destroy();
            return memberMovement;
        } catch (err) {
            console.error("Error deleting member nurmon movement:", err);
            throw err;
        }
    }
    
    private async validateMemberNurmonMovementData(data: MemberNurmonMovementCreateDTO) {

        const nurmonMovement = await this.db.NurmonMovement.findByPk(data.nurmon_movement_id);
        if (!nurmonMovement) {
            throw new Error("Nurmon movement not found");
        }

        const teamMember = await this.db.TeamMember.findByPk(data.team_member_id);
        if (!teamMember) {
            throw new Error("Team member not found");
        }

        // SI LA MIERDA ESTA NO PERTENECE AL PUTO NURMON
        if (teamMember.nurmon_id !== nurmonMovement.nurmon_id) {
            throw new Error("Nurmon movement does not belong to the team member's nurmon");
        }

        const existingMemberNurmonMovements = await this.db.MemberNurmonMovement.findAll({
            where : {
                team_member_id : data.team_member_id
            }
        });

        if(existingMemberNurmonMovements.length > 4){
            throw new Error("A team member can only have a maximum of 4 nurmon movements");
        }
    }
    
}

export default MemberNurmonMovementService;