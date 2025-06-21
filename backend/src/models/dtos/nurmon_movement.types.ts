

export interface NurmonMovementDTO {
    id : number;
    nurmon_id : number;
    movement_id  : number;
}

export interface NurmonMovementCreateDTO {
    nurmon_id : number;
    movement_id  : number;
}

export interface NurmonMovementUpdateDTO {
    nurmon_id? : number;
    movement_id?  : number;
}