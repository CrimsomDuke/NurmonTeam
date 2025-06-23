

export interface TeamMemberDTO {
    id : number;
    nickname : string;
    nurmon_id : number;
    team_id : number;
    nature_id : number | null;
    selected_ability_id : number | null;
    item_id : number | null;

    hp_ev : number;
    attack_ev : number ;
    def_ev : number;
    special_attack_ev : number;
    special_def_ev : number;
    speed_ev : number;

    hp_iv : number;
    attack_iv : number;
    def_iv : number;
    special_attack_iv : number;
    special_def_iv : number;
    speed_iv : number;
}

export interface TeamMemberCreateDTO {
    nickname : string;
    nurmon_id : number;
    team_id : number;
    nature_id : number | null;
    selected_ability_id : number | null;
    item_id : number | null;

    hp_ev : number;
    attack_ev : number ;
    def_ev : number;
    special_attack_ev : number;
    special_def_ev : number;
    speed_ev : number;

    hp_iv : number;
    attack_iv : number;
    def_iv : number;
    special_attack_iv : number;
    special_def_iv : number;
    speed_iv : number;
}

export interface TeamMemberUpdateDTO {
    nickname?: string;
    nurmon_id?: number;
    team_id?: number;
    nature_id?: number | null;
    selected_ability_id?: number | null;
    item_id?: number | null;

    hp_ev?: number;
    attack_ev?: number ;
    def_ev?: number;
    special_attack_ev?: number;
    special_def_ev?: number;
    speed_ev?: number;

    hp_iv?: number;
    attack_iv?: number;
    def_iv?: number;
    special_attack_iv?: number;
    special_def_iv?: number;
    speed_iv?: number;
}