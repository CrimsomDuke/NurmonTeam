
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