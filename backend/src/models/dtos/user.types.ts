

export interface UserDTO{
    id: number;
    username: string;
    email: string;
    password: string;
    is_admin : boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRegisterDTO {
    username : string;
    password : string;
    email : string;
    is_admin? : boolean;
}

export interface UserLoginDTO {
    username : string;
    password : string;
}

export interface UserPayload {
    id : number;
    username : string;
    email : string;
}

export interface UserUpdateDTO {
    id? : number;
    password? : string;
    is_admin? : boolean;
}