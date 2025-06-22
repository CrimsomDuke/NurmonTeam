

export interface TeamDTO {
    id : number;
    name : string;
    user_id : number;
}

export interface TeamCreateDTO {
    name : string;
    user_id : number;
}

export interface TeamUpdateDTO {
    name? : string;
    user_id? : number;
}