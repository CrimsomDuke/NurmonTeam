
export interface AppContextType {
    user: UserDataDTO | null;
    setUserInfo: (userDataDTO: UserDataDTO) => void;
    removeUserInfo: () => void;
}

export interface UserDataDTO {
    id: number;
    username: string;
    email: string;
    is_admin : boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface TypeDataDTO{
    id : number;
    name : string;
}

export interface AbilityDataDTO {
    id : number;
    name : string;
    description : string;
}


export interface NurmonDataDTO {
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
    type: TypeDataDTO | null;
}

export interface ItemDataDTO {
    id : number;
    name : string;
    description: string;
    image_path : string;
}

export interface MovementDataDTO{
    id : number;
    name : string;
    power : number;
    is_physical : boolean;
    type_id : number;
    type : TypeDataDTO | null;
}

export interface NurmonMovementDataDTO {
    id: number;
    nurmon_id: number;
    movement_id: number;
    movement: MovementDataDTO; // assuming relation populated
}

export interface MemberNurmonMovementDataDTO{
    id: number;
    team_member_id: number;
    nurmon_movement_id: number;
    nurmonMovement: NurmonMovementDataDTO; // assuming relation populated
}

export interface NatureDataDTO {
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

export interface TeamDataDTO {
    id : number;
    name : string;
    user_id : number;

    teamMembers : TeamMemberDataDTO[]; 
}

export interface TeamMemberDataDTO {
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

    nurmon: NurmonDataDTO;
    item: ItemDataDTO | null;
    selected_ability: AbilityDataDTO | null;
    nature: NatureDataDTO | null; // Assuming nature is a type, adjust if it's different
}
