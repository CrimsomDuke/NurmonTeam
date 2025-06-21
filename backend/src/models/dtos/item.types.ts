

export interface ItemDTO {
    id : number;
    name : string;
    description: string;
    image_path : string;
}

export interface ItemCreateDTO {
    name : string;
    description: string;
    image_path : string;
}

export interface ItemUpdateDTO {
    name? : string;
    description? : string;
    image_path? : string;
}
