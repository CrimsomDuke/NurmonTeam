

export interface NatureDTO {
    id : number;
    name : string;
    buff_stat : string;
    nerf_stat : string;
    hp_multiplier : number;
    def_multiplier : number;
    attack_multiplier : number;
    special_attack_multiplier : number;
    special_def_multiplier : number;
    speed_multiplier : number;
}

export interface NatureCreateDTO {
    buff_stat : string;
    nerf_stat : string;
    name : string;
    hp_multiplier : number;
    def_multiplier : number;
    attack_multiplier : number;
    special_attack_multiplier : number;
    special_def_multiplier : number;
    speed_multiplier : number;
}
