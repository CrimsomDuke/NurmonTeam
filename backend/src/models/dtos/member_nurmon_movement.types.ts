
export interface MemberNurmonMovementDTO {
    id: number;
    team_member_id: number;
    nurmon_movement_id: number;
}

export interface MemberNurmonMovementCreateDTO {
    team_member_id: number;
    nurmon_movement_id: number;
}

export interface MemberNurmonMovementUpdateWithMovementDTO {
    team_member_id?: number;
    movement_id? : number;
}