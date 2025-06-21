
export interface AppContextType {
    user: UserDataDTO | null;
    setUserInfo: (userDataDTO: UserDataDTO) => void;
    removeUserInfo: () => void;
}

export interface UserDataDTO {
    id: string;
    name: string;
    email: string;
    is_admin : string;
    createdAt: Date;
    updatedAt: Date;
}