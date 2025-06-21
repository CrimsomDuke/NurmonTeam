

import { createContext, useState } from "react";
import type { AppContextType, UserDataDTO } from "../types/types";

type AppProviderProps = {
    children: React.ReactNode;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children } : AppProviderProps) => {
    const [user, setUser] = useState<UserDataDTO | null>(null);

    const setUserInfo = (userDataDTO : UserDataDTO) => setUser(userDataDTO);
    const removeUserInfo = () => setUser(null);

    return (
        <AppContext.Provider value={{ user, setUserInfo, removeUserInfo }}>
            {children}
        </AppContext.Provider>
    );
}

