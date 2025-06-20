
export interface MovementDTO{
    id : number;
    name : string;
    power : number;
    is_physical : boolean;
    type_id : number;
}

export interface MovementCreateDTO {
    name: string;
    power: number;
    is_physical : boolean;
    type_id: number;
}

export interface MovementUpdateDTO {
    name?: string;
    power?: number;
    is_physical?: boolean;
    type_id?: number;
}