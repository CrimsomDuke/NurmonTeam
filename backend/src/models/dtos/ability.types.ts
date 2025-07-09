
export interface AbilityDTO {
    id : number;
    name : string;
    description : string;
}

export interface AbilityCreateDTO {
    name : string;
    description : string;
}

export interface AbilityUpdateDTO {
    id : number;
    name? : string;
    description? : string;
}