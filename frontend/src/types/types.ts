
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