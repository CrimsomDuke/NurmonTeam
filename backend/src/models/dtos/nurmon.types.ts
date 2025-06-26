import { AbilityDTO } from "./ability.types";


export interface NurmonDTO {
    id : number;
    name : string;
    image_path : string;
    hp : number;
    def : number;
    attack : number;
    special_attack : number;
    special_def : number;
    speed : number;
    type_id : number;
    first_ability_id : number | null;
    second_ability_id : number | null;
    third_ability_id : number | null;

    first_ability? : AbilityDTO | null;
    second_ability? : AbilityDTO | null;
    third_ability? : AbilityDTO | null;
}

export interface NurmonCreateDTO {
    name : string;
    image_path : string;
    hp : number;
    def : number;
    attack : number;
    special_attack : number;
    special_def : number;
    speed : number;
    type_id : number;
    first_ability_id? : number | null;
    second_ability_id? : number | null;
    third_ability_id? : number | null;
}

export interface NurmonUpdateDTO {
    name? : string;
    image_path? : string;
    hp? : number;
    def? : number;
    attack? : number;
    special_attack? : number;
    special_defense? : number;
    speed? : number;
    type_id? : number;
    first_ability_id? : number | null;
    second_ability_id? : number | null;
    third_ability_id? : number | null;
}